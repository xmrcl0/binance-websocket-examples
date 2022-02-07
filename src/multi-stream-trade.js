#!/usr/bin/env node

import getPairs from './lib/myservices/getPairs';
import logger from './lib/logger';
import SocketClient from './lib/socketClient';


export default async function createApp() {
  logger.info('Start application');

  // Get all active USDT pairs from binance
  let pairs = await getPairs()
  let lastCandles = createLastCandles(pairs)
  console.log(lastCandles)

  // Subscribes to trade websocket
  pairs = pairs.map((pair) => `${pair.toLowerCase()}@trade`);
  const pairString = pairs.join('/');
  logger.info(pairString);

  const socketApi = new SocketClient(`stream?streams=${pairString}`);
  pairs.forEach(pair => {
    socketApi.setHandler(pair, (params) => {
      //logger.info(JSON.stringify(params))
      //logger.info(params['data'])
      lastCandles = updateLastCandles(lastCandles, params)
      console.log(lastCandles)
    });
  })
}


const updateLastCandles = (lastCandles, params) => {
  var pair = params['data']['s']
  lastCandles[pair]['T'].push(params['data']['T'])
  lastCandles[pair]['p'].push(params['data']['p'])
  lastCandles[pair]['q'].push(params['data']['q'])
  return (lastCandles)
}


const createLastCandles = (pairs) => {
  var lastCandles = {};
  pairs.forEach(pair => {
    lastCandles[pair] = {
      'T': [],
      'p': [],
      'q': []
    }
  });
  return (lastCandles)
}


createApp();