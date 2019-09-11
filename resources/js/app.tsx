import React, { Component, lazy, Suspense } from 'react'
import { Layout, Menu } from 'antd'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

const Home = lazy(() => import(/* webpackChunkName: 'page-home' */ './pages/home'))
const Github = lazy(() => import(/* webpackChunkName: 'page-github' */ './pages/github'))
const Wakatime = lazy(() => import(/* webpackChunkName: 'page-wakatime' */ './pages/wakatime'))

const { Header, Content, Sider } = Layout

export default class App extends Component {
  // constructor (props) {
  //   super(props)
  // }

  componentDidMount (): void {
  }

  public render () {
    const pathname = location.pathname

    return (
      <Router>
        <Layout>
          <Header className="header flex">
            <div className="logo text-white">X-DASHBOARD</div>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[pathname]}
                style={{ height: '100%', borderRight: 0 }}
              >
                <Menu.Item key="/github">
                  <Link to="/github">Github</Link>
                </Menu.Item>
                <Menu.Item key="/wakatime">
                  <Link to="/wakatime">Wakatime</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Suspense fallback={<div>loading...</div>}>
                <Switch>
                  <Route path="/" exact component={Home}/>
                  <Route path="/github" exact component={Github}/>
                  <Route path="/wakatime" exact component={Wakatime}/>
                </Switch>
              </Suspense>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    )
  }
}
