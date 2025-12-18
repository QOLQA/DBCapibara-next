"use client";

import React from "react";
import type { Query } from "../../types";
import { DropDownQuerys } from "./DropDownQuerys";

const WordSelector = ({ word }: { word: string }) => {
	return <span className="text-blue">{`${word} `} </span>;
};

export const QueryItem = ({ query }: { query: Query }) => {
	return (
		<div className="flex flex-col items-start bg-gray w-full p-4 gap-3 rounded-lg relative">
			<div className="text-center py-2 px-3 w-full bg-cuartenary-gray rounded-lg text-white">
				{query.full_query.split(" ").map((word, index) => {
					const key = `${word}-${index}`;
					if (query.collections.includes(word)) {
						return <WordSelector word={word} key={key} />;
					}
					return <React.Fragment key={key}>{` ${word} `}</React.Fragment>;
				})}
			</div>
			<span className="text-p text-secondary-white">
				Involved Collections
			</span>
			<div className="flex flex-wrap gap-2.5 w-full pr-3">
				{query.collections.map((collection) => (
					<div
						key={`${collection}-query`}
						className="text-white border border-white text-p rounded-lg py-1 px-3 bg-transparent"
					>
						{collection}
					</div>
				))}
			</div>

			<DropDownQuerys editQuery={query} />
		</div>
	);
};
