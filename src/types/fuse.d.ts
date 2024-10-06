/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'fuse.js' {
	class Fuse<T> {
		constructor(list: T[], options?: Fuse.IFuseOptions<T>);
		search(pattern: string): Fuse.FuseResult<T>[];
	}

	namespace Fuse {
		interface IFuseOptions {
			isCaseSensitive?: boolean;
			includeScore?: boolean;
			shouldSort?: boolean;
			threshold?: number;
			location?: number;
			distance?: number;
			maxPatternLength?: number;
			minMatchCharLength?: number;
			keys?: any[];
			findAllMatches?: boolean;
			ignoreLocation?: boolean;
		}

		interface FuseResult<T> {
			item: T;
			score?: number;
		}
	}

	export = Fuse;
}
