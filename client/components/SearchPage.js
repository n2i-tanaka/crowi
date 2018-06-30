// This is the root component for #search-page

import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

import SearchForm from './SearchPage/SearchForm'
import SearchResult from './SearchPage/SearchResult'

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props)

    const { q = '' } = queryString.parse(this.props.crowi.location.search)

    this.state = {
      location: this.props.crowi.location,
      searchingKeyword: q,
      searchedKeyword: '',
      searchedPages: [],
      searchResultMeta: {},
      searchError: null,
    }

    this.search = this.search.bind(this)
    this.changeURL = this.changeURL.bind(this)
  }

  componentDidMount() {
    const keyword = this.state.searchingKeyword
    if (keyword !== '') {
      this.search({ keyword })
    }
  }

  changeURL(keyword, refreshHash) {
    let hash = location.hash || ''
    // TODO 整理する
    if (refreshHash || this.state.searchedKeyword !== '') {
      hash = ''
    }
    if (window.history && window.history.pushState) {
      window.history.pushState('', `Search - ${keyword}`, `/_search?q=${keyword}${hash}`)
    }
  }

  search(data) {
    const keyword = data.keyword
    if (keyword === '') {
      this.setState({
        searchingKeyword: '',
        searchedPages: [],
        searchResultMeta: {},
        searchError: null,
      })

      return true
    }

    this.setState({
      searchingKeyword: keyword,
    })

    this.props.crowi
      .apiGet('/search', { q: keyword })
      .then(res => {
        this.changeURL(keyword)

        this.setState({
          searchedKeyword: keyword,
          searchedPages: res.data,
          searchResultMeta: res.meta,
        })
      })
      .catch(err => {
        // TODO error
        this.setState({
          searchError: err,
        })
      })
  }

  render() {
    return (
      <div>
        <div className="header-wrap">
          <header>
            <SearchForm onSearchFormChanged={this.search} keyword={this.state.searchingKeyword} />
          </header>
        </div>

        <SearchResult
          pages={this.state.searchedPages}
          searchingKeyword={this.state.searchingKeyword}
          searchResultMeta={this.state.searchResultMeta}
        />
      </div>
    )
  }
}

SearchPage.propTypes = {
  crowi: PropTypes.object.isRequired,
}
SearchPage.defaultProps = {
  // pollInterval: 1000,
  searchError: null,
}