import React from "react";
import {inject, observer} from "mobx-react";
import {Action, LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";

@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      loading: false,
    };
  }

  render() {
    if(this.state.siteId) {
      return <Redirect to={`/code/${this.props.match.params.siteSelectorId}/${this.state.siteId}`} />;
    }

    const Submit = async () => {
      this.setState({loading: true});

      const siteId = await this.props.rootStore.RedeemCode(
        this.props.match.params.siteSelectorId,
        this.state.code
      );

      if(siteId) {
        this.setState({siteId});
      } else {
        this.setState({loading: false});
      }
    };

    return (
      <div className="code-entry">
        <h2>Enter your access code</h2>
        <div className="code-input">
          <input
            placeholder="Access Code"
            value={this.state.code}
            onChange={event => this.setState({code: event.target.value})}
            onKeyPress={onEnterPressed(Submit)}
          />
          <LoadingElement loading={this.state.loading}>
            <Action onClick={Submit}>Submit</Action>
          </LoadingElement>
        </div>
      </div>
    );
  }
}

export default CodeAccess;
