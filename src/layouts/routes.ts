import dynamic from 'next/dynamic'
import { MatchPathOptions } from 'helpers/matchPath'
import { ReactComponentLike } from 'prop-types'

const PublicContainer = dynamic(() => import('layouts/containers/Public'))

type Routes = {
  layout: ReactComponentLike
} & MatchPathOptions

const globalRoutes: Routes[] = [
  {
    path: '/',
    layout: PublicContainer,
  },
]

export default globalRoutes
