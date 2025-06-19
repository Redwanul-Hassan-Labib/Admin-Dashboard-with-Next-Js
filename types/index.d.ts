import React from 'react';

export type ChildrenProps = {
  children: React.ReactNode;
};

export type SlugParams = { params: Promise<{ slug: string }> };

export type SearchParamsProps = {
  searchParams: Promise<{
    category: string;
    search: string;
    page: string;
    sort: string;
  }>;
};

export type DashboardSearchParamsPros = {
  searchParams: Promise<{
    pageSize: string;
    search: string;
    pageIndex: string;
  }>;
};
