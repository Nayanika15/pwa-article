import { configure, extend, localize } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import en from "vee-validate/dist/locale/en.json";

// Configure passive mode
configure({ mode: "passive" });

// Install rules
for (let rule in rules) {
  // add the rule
  extend(rule, rules[rule]);
}

// Install messages
localize({ en });
