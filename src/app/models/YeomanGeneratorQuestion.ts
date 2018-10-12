import { JsonProperty, JsonObject, Any } from 'json2typescript';

interface IYeomanGeneratorQuestion {
  default?: any;
  message?: string;
  name?: string;
  type?: string;
  choices?: Array<any>;
}

@JsonObject
export class YeomanGeneratorQuestion {
  @JsonProperty('default', Any, true)
  public default?: any;

  @JsonProperty('message', String, true)
  public message?: string;

  @JsonProperty('name', String, true)
  public name?: string;

  @JsonProperty('type', String, true)
  public type?: string;

  @JsonProperty('choices', [Any], true)
  public choices?: Array<any>;


  constructor(question?: IYeomanGeneratorQuestion) {
    this.default = (question && question.default) || null;
    this.message = (question && question.message) || null;
    this.name = (question && question.name) || null;
    this.type = (question && question.type) || null;
    this.choices = (question && question.choices) || null;
  }

}
