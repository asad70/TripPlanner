/**
 * Interface for the response from the Wikipedia API.
 */
export interface WikipediaResponse {
  type: string;
  title: string;
  displaytitle: string;
  namespace: Namespace;
  wikibase_item: string;
  titles: Titles;
  pageid: number;
  thumbnail: Image;
  originalimage: Image;
  lang: string;
  dir: string;
  revision: string;
  tid: string;
  timestamp: string;
  description: string;
  description_source: string;
  coordinates: Coordinates;
  content_urls: ContentUrls;
  extract: string;
  extract_html: string;
}

/**
 * Interface for the namespace in the Wikipedia API response.
 */
interface Namespace {
  id: number;
  text: string;
}

/**
 * Interface for the titles in the Wikipedia API response.
 */
interface Titles {
  canonical: string;
  normalized: string;
  display: string;
}

/**
 * Interface for an image in the Wikipedia API response.
 */
interface Image {
  source: string;
  width: number;
  height: number;
}

/**
 * Interface for the coordinates in the Wikipedia API response.
 */
interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Interface for the content URLs in the Wikipedia API response.
 */
interface ContentUrls {
  desktop: Urls;
  mobile: Urls;
}

/**
 * Interface for the URLs in the Wikipedia API response.
 */
interface Urls {
  page: string;
  revisions: string;
  edit: string;
  talk: string;
}
