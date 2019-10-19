/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateBookmarkInput = {
  id?: string | null,
  name: string,
  url: string,
  owner?: string | null,
};

export type UpdateBookmarkInput = {
  id: string,
  name?: string | null,
  url?: string | null,
  owner?: string | null,
};

export type DeleteBookmarkInput = {
  id?: string | null,
};

export type ModelBookmarkFilterInput = {
  id?: ModelIDFilterInput | null,
  name?: ModelStringFilterInput | null,
  url?: ModelStringFilterInput | null,
  owner?: ModelStringFilterInput | null,
  and?: Array< ModelBookmarkFilterInput | null > | null,
  or?: Array< ModelBookmarkFilterInput | null > | null,
  not?: ModelBookmarkFilterInput | null,
};

export type ModelIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type CreateBookmarkMutationVariables = {
  input: CreateBookmarkInput,
};

export type CreateBookmarkMutation = {
  createBookmark: {
    __typename: 'Bookmark',
    id: string,
    name: string,
    url: string,
    owner: string | null,
  } | null,
};

export type UpdateBookmarkMutationVariables = {
  input: UpdateBookmarkInput,
};

export type UpdateBookmarkMutation = {
  updateBookmark: {
    __typename: 'Bookmark',
    id: string,
    name: string,
    url: string,
    owner: string | null,
  } | null,
};

export type DeleteBookmarkMutationVariables = {
  input: DeleteBookmarkInput,
};

export type DeleteBookmarkMutation = {
  deleteBookmark: {
    __typename: 'Bookmark',
    id: string,
    name: string,
    url: string,
    owner: string | null,
  } | null,
};

export type GetBookmarkQueryVariables = {
  id: string,
};

export type GetBookmarkQuery = {
  getBookmark: {
    __typename: 'Bookmark',
    id: string,
    name: string,
    url: string,
    owner: string | null,
  } | null,
};

export type ListBookmarksQueryVariables = {
  filter?: ModelBookmarkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBookmarksQuery = {
  listBookmarks: {
    __typename: 'ModelBookmarkConnection',
    items: Array< {
      __typename: 'Bookmark',
      id: string,
      name: string,
      url: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateBookmarkSubscriptionVariables = {
  owner: string,
};

export type OnCreateBookmarkSubscription = {
  onCreateBookmark: {
    __typename: 'Bookmark',
    id: string,
    name: string,
    url: string,
    owner: string | null,
  } | null,
};

export type OnUpdateBookmarkSubscriptionVariables = {
  owner: string,
};

export type OnUpdateBookmarkSubscription = {
  onUpdateBookmark: {
    __typename: 'Bookmark',
    id: string,
    name: string,
    url: string,
    owner: string | null,
  } | null,
};

export type OnDeleteBookmarkSubscriptionVariables = {
  owner: string,
};

export type OnDeleteBookmarkSubscription = {
  onDeleteBookmark: {
    __typename: 'Bookmark',
    id: string,
    name: string,
    url: string,
    owner: string | null,
  } | null,
};
