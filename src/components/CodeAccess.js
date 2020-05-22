import React from "react";
import {inject, observer} from "mobx-react";
import {Action, LoadingElement, onEnterPressed} from "elv-components-js";

@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      loading: false
    };
  }

  render() {
    const Submit = async () => {
      this.setState({loading: true});

      if(!await this.props.rootStore.RedeemCode(this.state.code)) {
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
