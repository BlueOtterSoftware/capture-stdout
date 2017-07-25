# Capture Stdout
[![Build Status](https://travis-ci.org/BlueOtterSoftware/capture-stdout.svg?branch=master)](https://travis-ci.org/BlueOtterSoftware/capture-stdout)

Capture Stdout is a small, efficient ES6 class that captures (they will not end up on stdout) all stdout calls and stores the calls as an array of strings.   Very useful for confirming expected output behavior during tests.  It is usable out of the box in any Node 8.x environment without transpilers or other dependencies.

## Usage

```
  it('should error and log an error message if the persistence call throws an error', async () => {
    const captureStdout = new CaptureStdout();
    const msg = 'some error text here';

    // stub out the persistence call
    const findAll = sandbox.stub(orm.books, 'findAll');
    // stubbed persistence call is a promise, fail as one.
    findAll.rejects(Error(msg));

    captureStdout.startCapture();

    controller.getAll(req, res, next);
    await res;
    await next;

    captureStdout.stopCapture();
    const arrJson = captureStdout.getCapturedText().map(JSON.parse);
    captureStdout.clearCaptureText();

    expect(arrJson).has.lengthOf(1);
    expect(arrJson[0]).has.property('msg').contains(msg);
    expect(arrJson[0]).has.property('level').which.equals(50);
  });
```

### Constructor
new CaptureStdout()
### Methods
#### clearCaptureText()
Clears all of the captured text
#### getCapturedText() → {Array} of String
#### startCapture()
Starts capturing the writes to process.stdout
#### stopCapture()
Stops capturing the writes to process.stdout.

## Motivation

I needed a simple, effective way to include logging of error messages in my tests.   I also didn't want to pollute the running test output.

## Installation

npm install capture-stdout

## Bugs

See https://github.com/BlueOtterSoftware/capture-stdout

## License

The MIT License (MIT)

Copyright (c) 2017 Blue Otter Software

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
