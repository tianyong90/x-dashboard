import React, { Component } from 'react'
import { Layout, Menu, Icon, Button, Table, Divider, message } from 'antd'
import Octokit from '@octokit/rest'
import parser from 'fast-xml-parser'
import { orderBy, groupBy } from 'lodash'
import axios from 'axios'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import GithubCalendar from '../components/github-calendar'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const { Column, ColumnGroup } = Table

export default class App extends Component {
  state = {
  }

  // constructor (props) {
  //   super(props)
  // }

  componentDidMount (): void {
  }

  public render () {
    return (
      <>
        <h1>home</h1>
      </>
    )
  }
}
