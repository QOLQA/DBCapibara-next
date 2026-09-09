import { describe, expect, it } from "vitest";
import {
	NESTED_BESIDE_ATTRIBUTE_THRESHOLD,
	NESTED_GRID_MAX_COLUMNS,
	getNestedTableLayout,
} from "./nested-layout";

describe("getNestedTableLayout", () => {
	it("stacks a single nested table when there are few attributes", () => {
		expect(getNestedTableLayout(2, 1)).toEqual({
			content: "stack",
			nesteds: "column",
			gridColumns: 1,
		});
		expect(
			getNestedTableLayout(NESTED_BESIDE_ATTRIBUTE_THRESHOLD, 1),
		).toEqual({
			content: "stack",
			nesteds: "column",
			gridColumns: 1,
		});
	});

	it("places a single nested table beside many attributes", () => {
		expect(
			getNestedTableLayout(NESTED_BESIDE_ATTRIBUTE_THRESHOLD + 1, 1),
		).toEqual({
			content: "split",
			nesteds: "column",
			gridColumns: 1,
		});
	});

	it("puts two nested tables side by side below few attributes", () => {
		expect(getNestedTableLayout(3, 2)).toEqual({
			content: "stack",
			nesteds: "grid",
			gridColumns: 2,
		});
	});

	it("uses three columns when there are three nested tables", () => {
		expect(getNestedTableLayout(6, 3)).toEqual({
			content: "split",
			nesteds: "grid",
			gridColumns: 3,
		});
	});

	it("caps the grid at three columns", () => {
		expect(getNestedTableLayout(2, 5).gridColumns).toBe(
			NESTED_GRID_MAX_COLUMNS,
		);
	});

	it("does not split when there are no nested tables", () => {
		expect(getNestedTableLayout(8, 0)).toEqual({
			content: "stack",
			nesteds: "column",
			gridColumns: 1,
		});
	});
});
