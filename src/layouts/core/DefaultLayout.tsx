import React from 'react'
import routes from 'layouts/routes'
import matchPath from 'helpers/matchPath'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const apolloClient = new ApolloClient({
  uri: 'https://graphql-pokeapi.vercel.app/api/graphql',
  cache: new InMemoryCache(),
})

const WrapperReactQuery = (props: any) => {
  const { children } = props

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

export const DefaultLayoutContext = React.createContext<
  {
    exact: boolean
    path: string
    layout: React.Component
  } & any
>({
  exact: undefined,
  path: undefined,
  layout: undefined,
})

function getSiteLayout(appProps) {
  const { Component, pageProps, router } = appProps
  const { route } = router

  for (let i = 0; i < routes.length; i += 1) {
    const curRoute = routes[i]
    const { exact, path, layout: PageLayout, ...layoutProps } = curRoute
    const match = matchPath(route, {
      path,
      exact,
    })
    if (match) {
      return (
        <DefaultLayoutContext.Provider value={curRoute}>
          <WrapperReactQuery>
            {PageLayout ? (
              <PageLayout {...appProps} layoutProps={layoutProps} />
            ) : (
              <Component {...pageProps} key={router.route} />
            )}
          </WrapperReactQuery>
        </DefaultLayoutContext.Provider>
      )
    }
  }

  return (
    <DefaultLayoutContext.Provider value={pageProps}>
      <WrapperReactQuery>
        <Component {...pageProps} key={router.route} />
      </WrapperReactQuery>
    </DefaultLayoutContext.Provider>
  )
}

export default getSiteLayout
