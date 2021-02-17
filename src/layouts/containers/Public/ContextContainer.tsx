import React from 'react'
import useStoragePokemon from 'hooks/useStoragePokemon/useStoragePokemon'

const ContextContainer = React.createContext<{
  storagePokemon: ReturnType<typeof useStoragePokemon>
}>({} as any)

export default ContextContainer
