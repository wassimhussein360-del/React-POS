import { liteClient } from "algoliasearch/lite";

const config = {
  AlgoliaAppID: "7WCNIV6R85",
  ALGOLIA_Search_SECRET: "de8b265b1c6f37eb5a17bbd82930c75b",
};

const client = liteClient(config.AlgoliaAppID, config.ALGOLIA_Search_SECRET);

export async function algoliaSearch(storeId: string, index: string, text: string): Promise<any[]> {
  if (text.length <= 2) {
    // Return an empty array as no search is performed
    return Promise.resolve([]);
  }

  let filters;
  if (index === "products") filters = `vendorId:${storeId}`;
  else if (index === "customers") {
    filters = [`vendors:${storeId}`];
  }

  try {
    const response = await client.search({
      requests: [
        {
          indexName: index,
          query: text,
          hitsPerPage: 50,
          facetFilters: [filters as string],
        },
      ],
    });

    const results = response.results;
    const hits: any = results[0];
    const records = hits?.hits || [];
    return records; // Return the search results
  } catch (error) {
    console.error("Search failed:", error);
    return Promise.reject(error); // Return the error in case of failure
  }
}
