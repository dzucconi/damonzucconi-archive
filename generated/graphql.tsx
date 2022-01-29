import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Autogenerated input type of AddArtworkMutation */
export type AddArtworkMutationInput = {
  attributes: ArtworkAttributes;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated return type of AddArtworkMutation */
export type AddArtworkMutationPayload = {
  __typename?: 'AddArtworkMutationPayload';
  artwork: Artwork;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** An artwork */
export type Artwork = {
  __typename?: 'Artwork';
  attachments: Array<Attachment>;
  collector_byline?: Maybe<Scalars['String']>;
  created_at: Scalars['String'];
  depth?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  dimensions?: Maybe<Dimensions>;
  duration?: Maybe<Scalars['String']>;
  editions: Array<Edition>;
  embeds: Array<Embed>;
  gloss?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  images: Array<Image>;
  intent: Scalars['String'];
  links: Array<Link>;
  material?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  slug: Scalars['String'];
  src?: Maybe<Scalars['String']>;
  state: Scalars['String'];
  title: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  updated_at: Scalars['String'];
  width?: Maybe<Scalars['Float']>;
  year: Scalars['Int'];
};


/** An artwork */
export type ArtworkCreated_AtArgs = {
  relative?: Maybe<Scalars['Boolean']>;
  format?: Maybe<Scalars['String']>;
};


/** An artwork */
export type ArtworkDescriptionArgs = {
  format?: Maybe<Format>;
};


/** An artwork */
export type ArtworkImagesArgs = {
  state?: Maybe<Array<State>>;
  limit?: Maybe<Scalars['Int']>;
};


/** An artwork */
export type ArtworkLinksArgs = {
  state?: Maybe<Array<State>>;
  kind?: Maybe<Array<Kind>>;
};


/** An artwork */
export type ArtworkUpdated_AtArgs = {
  relative?: Maybe<Scalars['Boolean']>;
  format?: Maybe<Scalars['String']>;
};

export type ArtworkAttributes = {
  title: Scalars['String'];
  year: Scalars['Int'];
  state: State;
  description?: Maybe<Scalars['String']>;
  gloss?: Maybe<Scalars['String']>;
  material?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  depth?: Maybe<Scalars['Float']>;
  unit?: Maybe<Scalars['String']>;
};

/** An attachment */
export type Attachment = {
  __typename?: 'Attachment';
  id: Scalars['String'];
  kind?: Maybe<Scalars['String']>;
  state: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

/** Dimensions */
export type Dimension = {
  __typename?: 'Dimension';
  depth?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  to_s?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Float']>;
};

/** Dimensions in metric and imperial */
export type Dimensions = {
  __typename?: 'Dimensions';
  centimeters: Dimension;
  inches: Dimension;
};

/** An edition */
export type Edition = {
  __typename?: 'Edition';
  collector?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  is_attributable: Scalars['Boolean'];
  location?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  state: Scalars['String'];
};

/** An embed */
export type Embed = {
  __typename?: 'Embed';
  html?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** An exhibition */
export type Exhibition = {
  __typename?: 'Exhibition';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  created_at: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  end_date?: Maybe<Scalars['String']>;
  external_url?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  images: Array<Image>;
  kind: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  start_date?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at: Scalars['String'];
  venue?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};


/** An exhibition */
export type ExhibitionCreated_AtArgs = {
  relative?: Maybe<Scalars['Boolean']>;
  format?: Maybe<Scalars['String']>;
};


/** An exhibition */
export type ExhibitionDescriptionArgs = {
  format?: Maybe<Format>;
};


/** An exhibition */
export type ExhibitionEnd_DateArgs = {
  relative?: Maybe<Scalars['Boolean']>;
  format?: Maybe<Scalars['String']>;
};


/** An exhibition */
export type ExhibitionImagesArgs = {
  state?: Maybe<Array<State>>;
  limit?: Maybe<Scalars['Int']>;
};


/** An exhibition */
export type ExhibitionStart_DateArgs = {
  relative?: Maybe<Scalars['Boolean']>;
  format?: Maybe<Scalars['String']>;
};


/** An exhibition */
export type ExhibitionUpdated_AtArgs = {
  relative?: Maybe<Scalars['Boolean']>;
  format?: Maybe<Scalars['String']>;
};

export enum Format {
  Plain = 'PLAIN',
  Html = 'HTML'
}

/** An image */
export type Image = {
  __typename?: 'Image';
  description?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  largest_side_display_size?: Maybe<Scalars['Int']>;
  position: Scalars['Int'];
  resized: ResizedImage;
  scale?: Maybe<Scalars['Float']>;
  state: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};


/** An image */
export type ImageResizedArgs = {
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  scale?: Maybe<Scalars['Float']>;
  quality?: Maybe<Scalars['Int']>;
  blur?: Maybe<Scalars['Float']>;
  sharpen?: Maybe<Scalars['Float']>;
};

export enum Kind {
  Default = 'DEFAULT',
  Canonical = 'CANONICAL'
}

/** A link */
export type Link = {
  __typename?: 'Link';
  id: Scalars['String'];
  kind: Scalars['String'];
  state: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  add_artwork?: Maybe<AddArtworkMutationPayload>;
  update_artwork?: Maybe<UpdateArtworkMutationPayload>;
};


export type MutationAdd_ArtworkArgs = {
  input: AddArtworkMutationInput;
};


export type MutationUpdate_ArtworkArgs = {
  input: UpdateArtworkMutationInput;
};

/** The query root for this schema */
export type Query = {
  __typename?: 'Query';
  /** An artwork */
  artwork: Artwork;
  artworks: Array<Artwork>;
  /** An exhibition */
  exhibition: Exhibition;
  exhibitions: Array<Exhibition>;
  presigned_upload_urls: Array<Scalars['String']>;
  /** An representation */
  representation: Representation;
  representations: Array<Representation>;
  /** System status */
  status: Status;
};


/** The query root for this schema */
export type QueryArtworkArgs = {
  id: Scalars['ID'];
};


/** The query root for this schema */
export type QueryArtworksArgs = {
  state?: Maybe<Array<Maybe<State>>>;
};


/** The query root for this schema */
export type QueryExhibitionArgs = {
  id: Scalars['ID'];
};


/** The query root for this schema */
export type QueryExhibitionsArgs = {
  state?: Maybe<Array<Maybe<State>>>;
};


/** The query root for this schema */
export type QueryPresigned_Upload_UrlsArgs = {
  types: Array<SupportedUpload>;
};


/** The query root for this schema */
export type QueryRepresentationArgs = {
  id: Scalars['ID'];
};

/** A representation of some other type */
export type Representation = {
  __typename?: 'Representation';
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  images: Array<Image>;
  mode: Scalars['String'];
  position: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

/** A resized image */
export type ResizedImage = {
  __typename?: 'ResizedImage';
  factor: Scalars['Float'];
  height: Scalars['Int'];
  ratio: Scalars['Float'];
  urls: RetinaImage;
  width: Scalars['Int'];
};

/** A retina image */
export type RetinaImage = {
  __typename?: 'RetinaImage';
  _1x: Scalars['String'];
  _2x: Scalars['String'];
  _3x: Scalars['String'];
};

export enum State {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Archived = 'ARCHIVED',
  Selected = 'SELECTED'
}

/** System status */
export type Status = {
  __typename?: 'Status';
  authenticated: Scalars['Boolean'];
  up: Scalars['Boolean'];
};

export enum SupportedUpload {
  Jpeg = 'JPEG',
  Png = 'PNG',
  Gif = 'GIF'
}

export type UpdateArtworkAttributes = {
  title?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
  state?: Maybe<State>;
  description?: Maybe<Scalars['String']>;
  gloss?: Maybe<Scalars['String']>;
  material?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  depth?: Maybe<Scalars['Float']>;
  unit?: Maybe<Scalars['String']>;
};

/** Autogenerated input type of UpdateArtworkMutation */
export type UpdateArtworkMutationInput = {
  id: Scalars['ID'];
  attributes: UpdateArtworkAttributes;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated return type of UpdateArtworkMutation */
export type UpdateArtworkMutationPayload = {
  __typename?: 'UpdateArtworkMutationPayload';
  artwork: Artwork;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SearchQueryVariables = Exact<{ [key: string]: never; }>;


export type SearchQuery = (
  { __typename?: 'Query' }
  & { artworks: Array<(
    { __typename?: 'Artwork' }
    & Pick<Artwork, 'id' | 'slug' | 'title'>
  )> }
);

export type TombstoneArtworkFragment = (
  { __typename?: 'Artwork' }
  & Pick<Artwork, 'title' | 'material' | 'duration' | 'year' | 'collector_byline'>
  & { dimensions?: Maybe<(
    { __typename?: 'Dimensions' }
    & { inches: (
      { __typename?: 'Dimension' }
      & Pick<Dimension, 'to_s'>
    ), centimeters: (
      { __typename?: 'Dimension' }
      & Pick<Dimension, 'to_s'>
    ) }
  )> }
);

export type ArtworksShowQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ArtworksShowQuery = (
  { __typename?: 'Query' }
  & { artwork: (
    { __typename?: 'Artwork' }
    & Pick<Artwork, 'id' | 'slug' | 'src' | 'title' | 'year' | 'intent' | 'description'>
    & { descriptionPlain: Artwork['description'] }
    & { attachments: Array<(
      { __typename?: 'Attachment' }
      & Pick<Attachment, 'id' | 'url' | 'title'>
    )>, links: Array<(
      { __typename?: 'Link' }
      & Pick<Link, 'title' | 'url'>
    )>, embeds: Array<(
      { __typename?: 'Embed' }
      & Pick<Embed, 'id' | 'html'>
    )>, images: Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'width' | 'height' | 'url'>
      & { placeholder: (
        { __typename?: 'ResizedImage' }
        & { urls: (
          { __typename?: 'RetinaImage' }
          & { src: RetinaImage['_1x'] }
        ) }
      ), display: (
        { __typename?: 'ResizedImage' }
        & Pick<ResizedImage, 'width' | 'height'>
        & { srcs: (
          { __typename?: 'RetinaImage' }
          & Pick<RetinaImage, '_1x' | '_2x' | '_3x'>
        ) }
      ) }
    )> }
    & TombstoneArtworkFragment
  ) }
);

export type ArtworksIndexQueryVariables = Exact<{ [key: string]: never; }>;


export type ArtworksIndexQuery = (
  { __typename?: 'Query' }
  & { artworks: Array<(
    { __typename?: 'Artwork' }
    & Pick<Artwork, 'id' | 'slug' | 'title' | 'material' | 'year'>
    & { images: Array<(
      { __typename?: 'Image' }
      & { placeholder: (
        { __typename?: 'ResizedImage' }
        & { urls: (
          { __typename?: 'RetinaImage' }
          & { src: RetinaImage['_1x'] }
        ) }
      ), resized: (
        { __typename?: 'ResizedImage' }
        & Pick<ResizedImage, 'width' | 'height'>
        & { urls: (
          { __typename?: 'RetinaImage' }
          & Pick<RetinaImage, '_1x' | '_2x' | '_3x'>
        ) }
      ) }
    )> }
  )> }
);

export type ArtworksTableQueryVariables = Exact<{ [key: string]: never; }>;


export type ArtworksTableQuery = (
  { __typename?: 'Query' }
  & { artworks: Array<(
    { __typename?: 'Artwork' }
    & Pick<Artwork, 'id' | 'slug' | 'title' | 'material' | 'year'>
  )> }
);

export const TombstoneArtworkFragmentDoc = gql`
    fragment TombstoneArtworkFragment on Artwork {
  title
  material
  duration
  year
  dimensions {
    inches {
      to_s
    }
    centimeters {
      to_s
    }
  }
  collector_byline
}
    `;
export const SearchQueryDocument = gql`
    query SearchQuery {
  artworks(state: [SELECTED, PUBLISHED]) {
    id
    slug
    title
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *   },
 * });
 */
export function useSearchQuery(baseOptions?: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchQueryDocument, options);
      }
export function useSearchQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchQueryDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchQueryLazyQueryHookResult = ReturnType<typeof useSearchQueryLazyQuery>;
export type SearchQueryQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const ArtworksShowQueryDocument = gql`
    query ArtworksShowQuery($id: ID!) {
  artwork(id: $id) {
    ...TombstoneArtworkFragment
    id
    slug
    src
    title
    year
    intent
    description(format: HTML)
    descriptionPlain: description(format: PLAIN)
    attachments {
      id
      url
      title
    }
    links(kind: DEFAULT, state: PUBLISHED) {
      title
      url
    }
    embeds {
      id
      html
    }
    images(state: PUBLISHED) {
      id
      width
      height
      url
      placeholder: resized(width: 50, height: 50) {
        urls {
          src: _1x
        }
      }
      display: resized(width: 1200, height: 1200) {
        width
        height
        srcs: urls {
          _1x
          _2x
          _3x
        }
      }
    }
  }
}
    ${TombstoneArtworkFragmentDoc}`;

/**
 * __useArtworksShowQuery__
 *
 * To run a query within a React component, call `useArtworksShowQuery` and pass it any options that fit your needs.
 * When your component renders, `useArtworksShowQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArtworksShowQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArtworksShowQuery(baseOptions: Apollo.QueryHookOptions<ArtworksShowQuery, ArtworksShowQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArtworksShowQuery, ArtworksShowQueryVariables>(ArtworksShowQueryDocument, options);
      }
export function useArtworksShowQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArtworksShowQuery, ArtworksShowQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArtworksShowQuery, ArtworksShowQueryVariables>(ArtworksShowQueryDocument, options);
        }
export type ArtworksShowQueryHookResult = ReturnType<typeof useArtworksShowQuery>;
export type ArtworksShowQueryLazyQueryHookResult = ReturnType<typeof useArtworksShowQueryLazyQuery>;
export type ArtworksShowQueryQueryResult = Apollo.QueryResult<ArtworksShowQuery, ArtworksShowQueryVariables>;
export const ArtworksIndexQueryDocument = gql`
    query ArtworksIndexQuery {
  artworks(state: [SELECTED, PUBLISHED]) {
    id
    slug
    title
    material
    year
    images(limit: 1, state: PUBLISHED) {
      placeholder: resized(width: 50, height: 50) {
        urls {
          src: _1x
        }
      }
      resized(width: 200, height: 200) {
        width
        height
        urls {
          _1x
          _2x
          _3x
        }
      }
    }
  }
}
    `;

/**
 * __useArtworksIndexQuery__
 *
 * To run a query within a React component, call `useArtworksIndexQuery` and pass it any options that fit your needs.
 * When your component renders, `useArtworksIndexQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArtworksIndexQuery({
 *   variables: {
 *   },
 * });
 */
export function useArtworksIndexQuery(baseOptions?: Apollo.QueryHookOptions<ArtworksIndexQuery, ArtworksIndexQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArtworksIndexQuery, ArtworksIndexQueryVariables>(ArtworksIndexQueryDocument, options);
      }
export function useArtworksIndexQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArtworksIndexQuery, ArtworksIndexQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArtworksIndexQuery, ArtworksIndexQueryVariables>(ArtworksIndexQueryDocument, options);
        }
export type ArtworksIndexQueryHookResult = ReturnType<typeof useArtworksIndexQuery>;
export type ArtworksIndexQueryLazyQueryHookResult = ReturnType<typeof useArtworksIndexQueryLazyQuery>;
export type ArtworksIndexQueryQueryResult = Apollo.QueryResult<ArtworksIndexQuery, ArtworksIndexQueryVariables>;
export const ArtworksTableQueryDocument = gql`
    query ArtworksTableQuery {
  artworks(state: [SELECTED, PUBLISHED]) {
    id
    slug
    title
    material
    year
  }
}
    `;

/**
 * __useArtworksTableQuery__
 *
 * To run a query within a React component, call `useArtworksTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useArtworksTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArtworksTableQuery({
 *   variables: {
 *   },
 * });
 */
export function useArtworksTableQuery(baseOptions?: Apollo.QueryHookOptions<ArtworksTableQuery, ArtworksTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArtworksTableQuery, ArtworksTableQueryVariables>(ArtworksTableQueryDocument, options);
      }
export function useArtworksTableQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArtworksTableQuery, ArtworksTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArtworksTableQuery, ArtworksTableQueryVariables>(ArtworksTableQueryDocument, options);
        }
export type ArtworksTableQueryHookResult = ReturnType<typeof useArtworksTableQuery>;
export type ArtworksTableQueryLazyQueryHookResult = ReturnType<typeof useArtworksTableQueryLazyQuery>;
export type ArtworksTableQueryQueryResult = Apollo.QueryResult<ArtworksTableQuery, ArtworksTableQueryVariables>;