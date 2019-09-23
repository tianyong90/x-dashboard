import React, { Component } from 'react'
import { Col, Empty, Layout, List, Row, Spin, Table, Typography } from 'antd'
import Octokit from '@octokit/rest'
import { groupBy, orderBy } from 'lodash'
import axios from 'axios'
import GithubCalendar from '../components/github-calendar'
import Parser from 'rss-parser'
import { graphql } from '@octokit/graphql'

const { Content } = Layout

const { Column } = Table

interface State {
  repos: object[]
  notifications: object
  feed: object
  isLoadingRepos: boolean
  isLoadingFeeds: boolean
}

export default class App extends Component<State> {
  state: State

  constructor (props) {
    super(props)

    this.state = {
      repos: [],
      notifications: [],
      feed: {},
      isLoadingRepos: false,
      isLoadingFeeds: false,
    }
  }

  async componentDidMount (): void {
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_OAUTH_TOKEN}`,
      },
    })

    const res = await graphqlWithAuth(
      `
    {
  user (login: "tianyong90") {
    name
    avatarUrl
    location
    repositories (last: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {direction: DESC, field: STARGAZERS}) {
      totalCount
      nodes {
        name
        url
        description
        stargazers (last: 1) {
          totalCount
        }
        forks (last: 1) {
          totalCount
        }
        watchers (last: 1) {
          totalCount
        }
      }
    }
  }
}
  `
    )

    this.setState({ repos: res.user.repositories.nodes })

    const octokit = new Octokit({
      log: console,
      auth: `token ${process.env.GITHUB_OAUTH_TOKEN}`,
    })

    octokit.activity.listNotifications().then(({ data }) => {
      const notifications = groupBy(data, item => {
        return item.repository.full_name
      })

      console.log(notifications)

      this.setState({ notifications })
    })

    // 获取 feed
    this.setState({ isLoadingFeeds: true })
    axios.get('github/private-feed-url').then(({ data: feedUrl }) => {
      const parser = new Parser()

      // 解决 cors 问题
      const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

      parser.parseURL(CORS_PROXY + feedUrl, (err, feed) => {
        this.setState({ isLoadingFeeds: false })

        if (err) {
          console.error(err)
          return
        }
        this.setState({ feed })
      })
    })
  }

  renderNotifications () {
    const { notifications } = this.state

    return <>
      {
        Object.keys(notifications).map(key => (
          <List
            className="bg-white mb-2"
            key={key}
            header={<a href={notifications[key][0].repository.url.replace('api.github.com/repos', 'github.com')}>{key}</a>}
            bordered
            dataSource={notifications[key]}
            renderItem={(notification: any) => (
              <List.Item>
                <Typography.Text mark>{notification.subject.type}</Typography.Text> <a href={notification.subject.url.replace('api.github.com/repos', 'github.com')}>{notification.subject.title}</a>
              </List.Item>
            )}
          />
        ))
      }
    </>
  }

  renderFeedList () {
    if (this.state.isLoadingFeeds) {
      return <div className="flex bg-white h-48 shadow justify-center items-center text-center"><Spin /></div>
    }

    const { feed } = this.state

    const items = (feed as any).items

    if (!items || !items.length) {
      return <Empty />
    }

    return <div className="feed-list mb-8 border shadow">
      {
        items.map((item, index) => (
          <div
            key={index}
            className="bg-white px-4 pt-1 pb-0 mb-0 border-b"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        ))
      }
    </div>
  }

  public render () {
    return (
      <>
        <Content className="mt-4 mx-4">
          <Row gutter={16}>
            <Col span={12}>
              {this.renderFeedList()}
            </Col>
            <Col span={12}>
              <div className="p-3 bg-white mb-4 shadow">
                <GithubCalendar/>
              </div>

              <Table
                dataSource={this.state.repos}
                bordered
                size="small"
                className="w-full bg-white shadow mb-4"
                rowKey="name"
                loading={ this.state.isLoadingRepos }
              >
                <Column
                  title="名称"
                  dataIndex="name"
                  key="name"
                />
                <Column
                  title="Stars"
                  dataIndex="stargazers"
                  key="stargazers"
                  render={stargazers => (
                    <span>{ stargazers.totalCount }</span>
                  )}
                />
                <Column
                  title="Forks"
                  dataIndex="forks"
                  key="forks"
                  render={forks => (
                    <span>{ forks.totalCount }</span>
                  )}
                />
                <Column
                  title="Watchers"
                  dataIndex="watchers"
                  key="watchers"
                  render={watchers => (
                    <span>{ watchers.totalCount }</span>
                  )}
                />
              </Table>

              <div className="w-full">
                { this.renderNotifications() }
              </div>
            </Col>
          </Row>
        </Content>
      </>
    )
  }
}
