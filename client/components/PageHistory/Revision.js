// @flow
import React from 'react'

import UserDate from 'components/Common/UserDate'
import Icon from 'components/Common/Icon'
import UserPicture from 'components/User/UserPicture'

type Props = {
  revision?: Object,
  onDiffOpenClicked: Function,
}

export default class Revision extends React.Component {
  constructor(props: Props) {
    super(props)

    this._onDiffOpenClicked = this._onDiffOpenClicked.bind(this)
  }

  props: Props

  componentDidMount() {}

  _onDiffOpenClicked() {
    this.props.onDiffOpenClicked(this.props.revision)
  }

  render() {
    const revision = this.props.revision
    const author = revision.author

    let pic = ''
    if (typeof author === 'object') {
      pic = <UserPicture user={author} />
    }

    return (
      <div className="revision-history-main">
        {pic}
        <div className="revision-history-author">
          <strong>{author.username}</strong>
        </div>
        <div className="revision-history-meta">
          <p>
            <UserDate dateTime={revision.createdAt} />
          </p>
          <p>
            <a href={'?revision=' + revision._id}>
              <Icon name="history" /> View this version
            </a>
            <a className="diff-view" onClick={this._onDiffOpenClicked}>
              <Icon name="level-down" /> View diff
            </a>
          </p>
        </div>
      </div>
    )
  }
}
