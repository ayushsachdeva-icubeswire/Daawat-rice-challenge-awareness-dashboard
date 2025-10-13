import { getMenuItems } from '@/helpers/Manu'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import AppMenu from './components/AppMenu'

const page = () => {
  const menuItems = getMenuItems()
  return (
    <div className="app-sidebar">
      {/* <LogoBox /> */}
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>
  )
}

export default page
