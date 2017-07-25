/**
 * @file capture-stdout.unit.js
 * Provides unit tests for CaptureStdout
 *
 * @author Randy Carver
 * @date 7/19/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Repository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 */
const mocha = require('mocha');
const chai = require('chai');
const CaptureStdout = require('../capture-stdout');
const logger = require('pino')();
/*
 * yes I could have written the test using console.log, I like quick validation via json
 */

const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;

describe('CaptureStdout', () => {
  it('should capture nothing when startCapture is not called', () => {
    const captureStdout = new CaptureStdout();
    const msg = 'OMG! It killed Kenny!';

    logger.error(msg);
    captureStdout.stopCapture();
    const json = captureStdout.getCapturedText().map(JSON.parse);
    captureStdout.clearCaptureText();

    expect(json).has.lengthOf(0);
  });

  it('should capture messages when startCapture is called', () => {
    const captureStdout = new CaptureStdout();
    const msg1 = 'OMG! It killed Kenny!';
    const msg2 = 'The bastard!';

    captureStdout.startCapture();
    logger.fatal(msg1);
    logger.error(msg2);
    captureStdout.stopCapture();
    const json = captureStdout.getCapturedText().map(JSON.parse);
    captureStdout.clearCaptureText();

    expect(json).has.lengthOf(2);
    expect(json[0]).has.property('msg').which.equals(msg1);
    expect(json[0]).has.property('level').which.equals(60);
    expect(json[1]).has.property('msg').which.equals(msg2);
    expect(json[1]).has.property('level').which.equals(50);
  });

  it('should stop capturing message when stopCapture is called', () => {
    const captureStdout = new CaptureStdout();
    const msg1 = 'OMG! It killed Kenny!';
    const msg2 = 'The bastard!';

    captureStdout.startCapture();
    logger.info(msg1);
    captureStdout.stopCapture();
    logger.trace(msg2);
    const json = captureStdout.getCapturedText().map(JSON.parse);
    captureStdout.clearCaptureText();

    expect(json).has.lengthOf(1);
  });

  it('should allow multiple start/stop capturing without clearing capture text', () => {
    const captureStdout = new CaptureStdout();
    const msg1 = 'OMG! It killed Kenny!';
    const msg2 = 'The bastard!';
    const msg3 = 'All your base';
    const msg4 = 'Are belong to us!';

    captureStdout.startCapture();
    logger.fatal(msg1);
    captureStdout.stopCapture();
    logger.error(msg2);
    captureStdout.startCapture();
    logger.warn(msg3);
    captureStdout.stopCapture();
    logger.info(msg4);
    const json = captureStdout.getCapturedText().map(JSON.parse);
    captureStdout.clearCaptureText();

    expect(json).has.lengthOf(2);
    expect(json[0]).has.property('msg').which.equals(msg1);
    expect(json[0]).has.property('level').which.equals(60);
    expect(json[1]).has.property('msg').which.equals(msg3);
    expect(json[1]).has.property('level').which.equals(40);
  });
});

