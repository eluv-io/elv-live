import React from "react";
import {inject, observer} from "mobx-react";
import {LoadingElement, onEnterPressed} from "elv-components-js";
import {Redirect} from "react-router";

@inject("rootStore")
@observer
class CodeAccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      loading: false,
      placeholder: "Enter your access code"
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
        <LoadingElement loading={this.state.loading}>
          <input
            onFocus={() => this.setState({placeholder: ""})}
            onBlur={() => this.setState({placeholder: "Enter your access code"})}
            placeholder={this.state.placeholder}
            value={this.state.code}
            onChange={event => this.setState({code: event.target.value})}
            onKeyPress={onEnterPressed(Submit)}
            autoFocus
          />
          <button onClick={Submit} title="Submit">Submit</button>
        </LoadingElement>
      </div>
    );
  }
}

export default CodeAccess;
