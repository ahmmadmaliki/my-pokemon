import React from 'react'
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing'
import { ContextHeader } from 'layouts/containers/Public/Header/Header'

const mockWrapperLayout = (
  children,
  mockApolloProviderProps?: MockedProviderProps,
) => {
  return (
    <MockedProvider
      addTypename={false}
      defaultOptions={{ watchQuery: { fetchPolicy: 'no-cache' } }}
      {...mockApolloProviderProps}
    >
      <ContextHeader.Provider value={{ setProps: () => {} }}>
        {children}
      </ContextHeader.Provider>
    </MockedProvider>
  )
}

export default mockWrapperLayout
