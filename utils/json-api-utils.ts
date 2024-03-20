export function parseLinkHeaderAndGetLastPage(linkHeader: string | null): number {
    // Function to parse the link header
    if(!linkHeader) return 1
    function parseLinkHeader(header: string) {
        const linkComponents = header.split(', ');
        const linkMap = linkComponents.map((component: string) => {
            const [url, rel] = component.split('; ');
            const cleanUrl = url.slice(1, -1); // Remove angle brackets
            const cleanRel = rel.replace(/rel="/g, '').replace(/"/g, ''); // Remove 'rel="' and quotes
            return [cleanRel, cleanUrl];
        });
        return Object.fromEntries(linkMap);
    }

    // Parse the link header
    const parsedLinks = parseLinkHeader(linkHeader);

    // Extract the '_page' parameter from the last page URL
    const lastPageUrl = parsedLinks.last;
    const url = new URL(lastPageUrl);
    const searchParams = url.searchParams;
    const lastPageNumber = searchParams.get('_page');

    return Number(lastPageNumber);
}