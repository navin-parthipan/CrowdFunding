import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Drizzle, generateStore } from "@drizzle/store";
import CrowdFunding from "./contracts/CrowdFundingWithDeadline.json";

console.log(CrowdFunding)
const options = { contracts: [CrowdFunding] };

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));
