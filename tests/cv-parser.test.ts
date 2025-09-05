// tests/cv-parser.test.ts
import { CVParser } from "../src/server/services/cv-parser";
import * as fs from "fs";
import * as path from "path";

describe("CVParser", () => {
	let cvParser: CVParser;
	const testDataPath = path.join(
		process.cwd(),
		"data",
		"extracted-cv-data.json"
	);

	beforeEach(() => {
		cvParser = new CVParser();
	});

	test("should create CVParser instance", () => {
		expect(cvParser).toBeInstanceOf(CVParser);
		expect(cvParser.isReady()).toBe(false);
	});

	test("should search CV data when loaded from JSON", async () => {
		// Check if test data exists
		if (fs.existsSync(testDataPath)) {
			// Load from existing JSON data
			const pdfPath = path.join(
				process.cwd(),
				"public",
				"adeesh_perera_resume.pdf"
			);
			await cvParser.loadCV(pdfPath);

			expect(cvParser.isReady()).toBe(true);

			// Test searching for skills
			const skillsResponse = cvParser.searchCV("What skills do you have?");
			expect(skillsResponse).toContain("skills");
			expect(typeof skillsResponse).toBe("string");
		} else {
			// Skip test if no data file exists
			console.log("Skipping CV data test - no extracted data file found");
		}
	});

	test("should handle questions about different CV sections", async () => {
		if (fs.existsSync(testDataPath)) {
			const pdfPath = path.join(
				process.cwd(),
				"public",
				"adeesh_perera_resume.pdf"
			);
			await cvParser.loadCV(pdfPath);

			// Test education question
			const educationResponse = cvParser.searchCV("Tell me about education");
			expect(typeof educationResponse).toBe("string");
			expect(educationResponse.length).toBeGreaterThan(0);

			// Test contact question
			const contactResponse = cvParser.searchCV(
				"What is the contact information?"
			);
			expect(typeof contactResponse).toBe("string");
			expect(contactResponse.length).toBeGreaterThan(0);
		} else {
			console.log("Skipping CV sections test - no extracted data file found");
		}
	});

	test("should return appropriate message for unknown questions", async () => {
		if (fs.existsSync(testDataPath)) {
			const pdfPath = path.join(
				process.cwd(),
				"public",
				"adeesh_perera_resume.pdf"
			);
			await cvParser.loadCV(pdfPath);

			const response = cvParser.searchCV("What is the meaning of life?");
			expect(response).toContain("couldn't find specific information");
		} else {
			console.log(
				"Skipping unknown questions test - no extracted data file found"
			);
		}
	});
});
