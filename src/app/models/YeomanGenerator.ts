import { JsonProperty, JsonObject } from 'json2typescript';

interface IYeomanGenerator {
  description: string;
  isCompatible: boolean;
  name: string;
  officialGenerator: boolean;
  version: string;
}

@JsonObject
export class YeomanGenerator {
  @JsonProperty('description', String)
  public description: string;

  @JsonProperty('isCompatible', Boolean)
  public isCompatible: boolean;

  @JsonProperty('name', String)
  public name: string;

  @JsonProperty('officialGenerator', Boolean)
  public officialGenerator: boolean;

  @JsonProperty('version', String)
  public version: string;

  constructor(generator?: IYeomanGenerator) {
    this.description = (generator && generator.description) || null;
    this.isCompatible = (generator && generator.isCompatible) || null;
    this.name = (generator && generator.name) || null;
    this.officialGenerator = (generator && generator.officialGenerator) || null;
    this.version = (generator && generator.version) || null;
  }

}
