// src/server/services/cv-parser.ts
import * as fs from "fs";
import * as path from "path";
import pdf from "pdf-parse";

// Keywords for section identification
const SECTION_KEYWORDS = {
	education: [
		"education",
		"degree",
		"university",
		"college",
		"study",
		"bsc",
		"msc",
		"phd",
	],
	skills: [
		"skills",
		"technologies",
		"programming",
		"languages",
		"frameworks",
		"tools",
	],
	projects: ["projects", "project", "built", "developed", "created", "github"],
	experience: ["experience", "work", "employment", "job", "position", "role"],
	contact: ["contact", "phone", "email", "location", "address", "linkedin"],
};

interface CVData {
	education: string[];
	skills: string[];
	projects: string[];
	experience: string[];
	contact: string[];
	rawText: string;
	extractedAt: string;
}

function extractStructuredData(cvText: string): CVData {
	const lines = cvText.split("\n").filter((line) => line.trim().length > 0);
	const data: CVData = {
		education: [],
		skills: [],
		projects: [],
		experience: [],
		contact: [],
		rawText: cvText,
		extractedAt: new Date().toISOString(),
	};

	// Extract each section
	for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
		const sectionContent = extractSectionLines(lines, keywords);
		data[section as keyof Omit<CVData, "rawText" | "extractedAt">] =
			sectionContent;
	}

	return data;
}

function extractSectionLines(lines: string[], keywords: string[]): string[] {
	const sectionLines: string[] = [];
	let sectionStartIndex = -1;

	// Find section start
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].toLowerCase();
		if (keywords.some((keyword) => line.includes(keyword))) {
			sectionStartIndex = i;
			break;
		}
	}

	if (sectionStartIndex === -1) return sectionLines;

	// Extract lines from section
	for (let i = sectionStartIndex; i < lines.length; i++) {
		const line = lines[i].trim();
		if (line.length === 0) continue;

		// Check if we've hit a new section
		const isNewSection = Object.values(SECTION_KEYWORDS).some((otherKeywords) =>
			otherKeywords.some(
				(keyword) =>
					line.toLowerCase().includes(keyword) && i > sectionStartIndex + 2
			)
		);

		if (isNewSection) break;

		sectionLines.push(line);

		// Limit to reasonable number of lines per section
		if (sectionLines.length >= 10) break;
	}

	return sectionLines;
}

function saveDataToJSON(data: CVData): void {
	const jsonPath = path.join(process.cwd(), "data", "extracted-cv-data.json");
	try {
		fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
		console.log("CV data saved to data/extracted-cv-data.json");
	} catch (error) {
		console.error("Error saving CV data:", error);
	}
}

function loadDataFromJSON(): CVData | null {
	const jsonPath = path.join(process.cwd(), "data", "extracted-cv-data.json");
	try {
		if (fs.existsSync(jsonPath)) {
			const jsonContent = fs.readFileSync(jsonPath, "utf-8");
			console.log("CV data loaded from data/extracted-cv-data.json");
			return JSON.parse(jsonContent);
		}
	} catch (error) {
		console.error("Error loading CV data:", error);
	}
	return null;
}

function answerQuestionFromData(data: CVData, question: string): string {
	const lowerQuestion = question.toLowerCase();

	// Determine which section the question is about
	for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
		if (keywords.some((keyword) => lowerQuestion.includes(keyword))) {
			const sectionData =
				data[section as keyof Omit<CVData, "rawText" | "extractedAt">];
			if (sectionData && sectionData.length > 0) {
				return `Here's information about ${section}:\n${sectionData
					.slice(0, 5)
					.join("\n")}`;
			} else {
				return `I found the ${section} section but no specific content was extracted.`;
			}
		}
	}

	// If no specific section found, search across all content
	const questionWords = lowerQuestion
		.split(" ")
		.filter((word) => word.length > 2);
	for (const [section, content] of Object.entries(data)) {
		if (section === "rawText" || section === "extractedAt") continue;

		const relevantLines = (content as string[]).filter((line) =>
			questionWords.some((word) => line.toLowerCase().includes(word))
		);

		if (relevantLines.length > 0) {
			return `Found relevant information:\n${relevantLines
				.slice(0, 3)
				.join("\n")}`;
		}
	}

	return "I couldn't find specific information about that in the CV. You can ask about education, skills, projects, experience, or contact information.";
}

export class CVParser {
	private cvData: CVData | null = null;
	private isLoaded: boolean = false;

	async loadCV(pdfPath: string): Promise<void> {
		try {
			// First try to load from existing JSON
			const existingData = loadDataFromJSON();
			if (existingData) {
				this.cvData = existingData;
				this.isLoaded = true;
				console.log("CV data loaded from existing JSON file");
				return;
			}

			// If no JSON exists, extract from PDF
			console.log("Extracting data from PDF...");
			const dataBuffer = fs.readFileSync(pdfPath);
			const data = await pdf(dataBuffer);

			// Extract structured data
			this.cvData = extractStructuredData(data.text);
			this.isLoaded = true;

			// Save to JSON for future use
			saveDataToJSON(this.cvData);

			console.log("CV loaded and data extracted successfully");
			console.log(
				"Extracted sections:",
				Object.keys(this.cvData).filter(
					(k) => k !== "rawText" && k !== "extractedAt"
				)
			);
		} catch (error) {
			console.error("Error loading CV:", error);
			this.isLoaded = false;
		}
	}

	searchCV(query: string): string {
		if (!this.isLoaded || !this.cvData) {
			return "CV data is not loaded. Please try again.";
		}

		// Use structured data to answer questions
		return answerQuestionFromData(this.cvData, query);
	}

	isReady(): boolean {
		return this.isLoaded && this.cvData !== null;
	}

	getCVData(): CVData | null {
		return this.cvData;
	}

	// Method to force re-extraction from PDF
	async reExtractFromPDF(pdfPath: string): Promise<void> {
		try {
			console.log("Force re-extracting data from PDF...");
			const dataBuffer = fs.readFileSync(pdfPath);
			const data = await pdf(dataBuffer);

			this.cvData = extractStructuredData(data.text);
			this.isLoaded = true;

			saveDataToJSON(this.cvData);
			console.log("CV data re-extracted and saved");
		} catch (error) {
			console.error("Error re-extracting CV:", error);
			this.isLoaded = false;
		}
	}
}
