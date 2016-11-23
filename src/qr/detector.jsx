/*
  Ported to JavaScript by Lazar Laszlo 2011 
  
  lazarsoft@gmail.com, www.lazarsoft.info
  
	Ported to ES6 By Ramiro Rojo <ramiro.rojo.cretta@gmail.com>

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import GridSampler from './grid';
import { Version } from './version';

export class PerspectiveTransform {

    constructor(a11, a21, a31, a12, a22, a32, a13, a23, a33) {
        this.a11 = a11;
        this.a12 = a12;
        this.a13 = a13;
        this.a21 = a21;
        this.a22 = a22;
        this.a23 = a23;
        this.a31 = a31;
        this.a32 = a32;
        this.a33 = a33;
    }

    transformPoints1(points) {
        let max = points.length;
        let a11 = this.a11;
        let a12 = this.a12;
        let a13 = this.a13;
        let a21 = this.a21;
        let a22 = this.a22;
        let a23 = this.a23;
        let a31 = this.a31;
        let a32 = this.a32;
        let a33 = this.a33;
        for (let i = 0; i < max; i += 2) {
            let x = points[i];
            let y = points[i + 1];
            let denominator = a13 * x + a23 * y + a33;
            points[i] = (a11 * x + a21 * y + a31) / denominator;
            points[i + 1] = (a12 * x + a22 * y + a32) / denominator;
        }
    }

    transformPoints2(xValues, yValues) {
        let n = xValues.length;
        for (let i = 0; i < n; i++) {
            let x = xValues[i];
            let y = yValues[i];
            let denominator = this.a13 * x + this.a23 * y + this.a33;
            xValues[i] = (this.a11 * x + this.a21 * y + this.a31) / denominator;
            yValues[i] = (this.a12 * x + this.a22 * y + this.a32) / denominator;
        }
    }

    buildAdjoint() {
        return new PerspectiveTransform(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21);
    }

    times(other) {
        return new PerspectiveTransform(this.a11 * other.a11 + this.a21 * other.a12 + this.a31 * other.a13, this.a11 * other.a21 + this.a21 * other.a22 + this.a31 * other.a23, this.a11 * other.a31 + this.a21 * other.a32 + this.a31 * other.a33, this.a12 * other.a11 + this.a22 * other.a12 + this.a32 * other.a13, this.a12 * other.a21 + this.a22 * other.a22 + this.a32 * other.a23, this.a12 * other.a31 + this.a22 * other.a32 + this.a32 * other.a33, this.a13 * other.a11 + this.a23 * other.a12 + this.a33 * other.a13, this.a13 * other.a21 + this.a23 * other.a22 + this.a33 * other.a23, this.a13 * other.a31 + this.a23 * other.a32 + this.a33 * other.a33);
    }

    static quadrilateralToQuadrilateral(x0, y0, x1, y1, x2, y2, x3, y3, x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p) {

        let qToS = this.quadrilateralToSquare(x0, y0, x1, y1, x2, y2, x3, y3);
        let sToQ = this.squareToQuadrilateral(x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p);
        return sToQ.times(qToS);
    }


    static squareToQuadrilateral(x0, y0, x1, y1, x2, y2, x3, y3) {
        dy2 = y3 - y2;
        dy3 = y0 - y1 + y2 - y3;
        if (dy2 == 0.0 && dy3 == 0.0) {
            return new PerspectiveTransform(x1 - x0, x2 - x1, x0, y1 - y0, y2 - y1, y0, 0.0, 0.0, 1.0);
        }
        else {
            dx1 = x1 - x2;
            dx2 = x3 - x2;
            dx3 = x0 - x1 + x2 - x3;
            dy1 = y1 - y2;
            denominator = dx1 * dy2 - dx2 * dy1;
            a13 = (dx3 * dy2 - dx2 * dy3) / denominator;
            a23 = (dx1 * dy3 - dx3 * dy1) / denominator;
            return new PerspectiveTransform(x1 - x0 + a13 * x1, x3 - x0 + a23 * x3, x0, y1 - y0 + a13 * y1, y3 - y0 + a23 * y3, y0, a13, a23, 1.0);
        }
    }

    static quadrilateralToSquare(x0, y0, x1, y1, x2, y2, x3, y3) {
        return this.squareToQuadrilateral(x0, y0, x1, y1, x2, y2, x3, y3).buildAdjoint();
    }

}

export class DetectorResult {

    constructor(bits, points) {
        this.bits = bits;
        this.points = points;
    }

}

export class Detector {

    constructor(image) {
        this.image = image;
        this.resultPointCallback = null;
    }

    sizeOfBlackWhiteBlackRun(fromX, fromY, toX, toY) {
        // Mild letiant of Bresenham's algorithm;
        // see http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
        let steep = Math.abs(toY - fromY) > Math.abs(toX - fromX);
        if (steep) {
            let temp = fromX;
            fromX = fromY;
            fromY = temp;
            temp = toX;
            toX = toY;
            toY = temp;
        }

        let dx = Math.abs(toX - fromX);
        let dy = Math.abs(toY - fromY);
        let error = - dx >> 1;
        let ystep = fromY < toY ? 1 : - 1;
        let xstep = fromX < toX ? 1 : - 1;
        let state = 0; // In black pixels, looking for white, first or second time
        for (let x = fromX, y = fromY; x != toX; x += xstep) {

            let realX = steep ? y : x;
            let realY = steep ? x : y;
            if (state == 1) {
                // In white pixels, looking for black
                if (this.image[realX + realY * qrcode.width]) {
                    state++;
                }
            }
            else {
                if (!this.image[realX + realY * qrcode.width]) {
                    state++;
                }
            }

            if (state == 3) {
                // Found black, white, black, and stumbled back onto white; done
                let diffX = x - fromX;
                let diffY = y - fromY;
                return Math.sqrt((diffX * diffX + diffY * diffY));
            }
            error += dy;
            if (error > 0) {
                if (y == toY) {
                    break;
                }
                y += ystep;
                error -= dx;
            }
        }
        let diffX2 = toX - fromX;
        let diffY2 = toY - fromY;
        return Math.sqrt((diffX2 * diffX2 + diffY2 * diffY2));
    }

    sizeOfBlackWhiteBlackRunBothWays(fromX, fromY, toX, toY) {

        let result = this.sizeOfBlackWhiteBlackRun(fromX, fromY, toX, toY);

        // Now count other way -- don't run off image though of course
        let scale = 1.0;
        let otherToX = fromX - (toX - fromX);
        if (otherToX < 0) {
            scale = fromX / (fromX - otherToX);
            otherToX = 0;
        }
        else if (otherToX >= qrcode.width) {
            scale = (qrcode.width - 1 - fromX) / (otherToX - fromX);
            otherToX = qrcode.width - 1;
        }
        let otherToY = Math.floor(fromY - (toY - fromY) * scale);

        scale = 1.0;
        if (otherToY < 0) {
            scale = fromY / (fromY - otherToY);
            otherToY = 0;
        }
        else if (otherToY >= qrcode.height) {
            scale = (qrcode.height - 1 - fromY) / (otherToY - fromY);
            otherToY = qrcode.height - 1;
        }
        otherToX = Math.floor(fromX + (otherToX - fromX) * scale);

        result += this.sizeOfBlackWhiteBlackRun(fromX, fromY, otherToX, otherToY);
        return result - 1.0; // -1 because we counted the middle pixel twice
    }

    calculateModuleSizeOneWay(pattern, otherPattern) {
        let moduleSizeEst1 = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(pattern.X), Math.floor(pattern.Y), Math.floor(otherPattern.X), Math.floor(otherPattern.Y));
        let moduleSizeEst2 = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(otherPattern.X), Math.floor(otherPattern.Y), Math.floor(pattern.X), Math.floor(pattern.Y));
        if (isNaN(moduleSizeEst1)) {
            return moduleSizeEst2 / 7.0;
        }
        if (isNaN(moduleSizeEst2)) {
            return moduleSizeEst1 / 7.0;
        }
        // Average them, and divide by 7 since we've counted the width of 3 black modules,
        // and 1 white and 1 black module on either side. Ergo, divide sum by 14.
        return (moduleSizeEst1 + moduleSizeEst2) / 14.0;
    }

    calculateModuleSize(topLeft, topRight, bottomLeft) {
        // Take the average
        return (this.calculateModuleSizeOneWay(topLeft, topRight) + this.calculateModuleSizeOneWay(topLeft, bottomLeft)) / 2.0;
    }

    distance(pattern1, pattern2) {
        xDiff = pattern1.X - pattern2.X;
        yDiff = pattern1.Y - pattern2.Y;
        return Math.sqrt((xDiff * xDiff + yDiff * yDiff));
    }

    computeDimension(topLeft, topRight, bottomLeft, moduleSize) {

        let tltrCentersDimension = Math.round(this.distance(topLeft, topRight) / moduleSize);
        let tlblCentersDimension = Math.round(this.distance(topLeft, bottomLeft) / moduleSize);
        let dimension = ((tltrCentersDimension + tlblCentersDimension) >> 1) + 7;
        switch (dimension & 0x03) {

            // mod 4
            case 0:
                dimension++;
                break;
            // 1? do nothing

            case 2:
                dimension--;
                break;

            case 3:
                throw "Error";
        }
        return dimension;
    }

    findAlignmentInRegion(overallEstModuleSize, estAlignmentX, estAlignmentY, allowanceFactor) {
        // Look for an alignment pattern (3 modules in size) around where it
        // should be
        let allowance = Math.floor(allowanceFactor * overallEstModuleSize);
        let alignmentAreaLeftX = Math.max(0, estAlignmentX - allowance);
        let alignmentAreaRightX = Math.min(qrcode.width - 1, estAlignmentX + allowance);
        if (alignmentAreaRightX - alignmentAreaLeftX < overallEstModuleSize * 3) {
            throw "Error";
        }

        let alignmentAreaTopY = Math.max(0, estAlignmentY - allowance);
        let alignmentAreaBottomY = Math.min(qrcode.height - 1, estAlignmentY + allowance);

        let alignmentFinder = new AlignmentPatternFinder(this.image, alignmentAreaLeftX, alignmentAreaTopY, alignmentAreaRightX - alignmentAreaLeftX, alignmentAreaBottomY - alignmentAreaTopY, overallEstModuleSize, this.resultPointCallback);
        return alignmentFinder.find();
    }

    createTransform(topLeft, topRight, bottomLeft, alignmentPattern, dimension) {
        let dimMinusThree = dimension - 3.5;
        let bottomRightX;
        let bottomRightY;
        let sourceBottomRightX;
        let sourceBottomRightY;
        if (alignmentPattern != null) {
            bottomRightX = alignmentPattern.X;
            bottomRightY = alignmentPattern.Y;
            sourceBottomRightX = sourceBottomRightY = dimMinusThree - 3.0;
        }
        else {
            // Don't have an alignment pattern, just make up the bottom-right point
            bottomRightX = (topRight.X - topLeft.X) + bottomLeft.X;
            bottomRightY = (topRight.Y - topLeft.Y) + bottomLeft.Y;
            sourceBottomRightX = sourceBottomRightY = dimMinusThree;
        }

        let transform = PerspectiveTransform.quadrilateralToQuadrilateral(3.5, 3.5, dimMinusThree, 3.5, sourceBottomRightX, sourceBottomRightY, 3.5, dimMinusThree, topLeft.X, topLeft.Y, topRight.X, topRight.Y, bottomRightX, bottomRightY, bottomLeft.X, bottomLeft.Y);

        return transform;
    }

    sampleGrid(image, transform, dimension) {

        let sampler = GridSampler;
        return sampler.sampleGrid3(image, dimension, transform);
    }

    processFinderPatternInfo(info) {

        let topLeft = info.TopLeft;
        let topRight = info.TopRight;
        let bottomLeft = info.BottomLeft;

        let moduleSize = this.calculateModuleSize(topLeft, topRight, bottomLeft);
        if (moduleSize < 1.0) {
            throw "Error";
        }
        let dimension = this.computeDimension(topLeft, topRight, bottomLeft, moduleSize);
        let provisionalVersion = Version.getProvisionalVersionForDimension(dimension);
        let modulesBetweenFPCenters = provisionalVersion.DimensionForVersion - 7;

        let alignmentPattern = null;
        // Anything above version 1 has an alignment pattern
        if (provisionalVersion.AlignmentPatternCenters.length > 0) {

            // Guess where a "bottom right" finder pattern would have been
            let bottomRightX = topRight.X - topLeft.X + bottomLeft.X;
            let bottomRightY = topRight.Y - topLeft.Y + bottomLeft.Y;

            // Estimate that alignment pattern is closer by 3 modules
            // from "bottom right" to known top left location
            let correctionToTopLeft = 1.0 - 3.0 / modulesBetweenFPCenters;
            let estAlignmentX = Math.floor(topLeft.X + correctionToTopLeft * (bottomRightX - topLeft.X));
            let estAlignmentY = Math.floor(topLeft.Y + correctionToTopLeft * (bottomRightY - topLeft.Y));

            // Kind of arbitrary -- expand search radius before giving up
            for (let i = 4; i <= 16; i <<= 1) {
                //try
                //{
                alignmentPattern = this.findAlignmentInRegion(moduleSize, estAlignmentX, estAlignmentY, i);
                break;
                //}
                //catch (re)
                //{
                // try next round
                //}
            }
            // If we didn't find alignment pattern... well try anyway without it
        }

        let transform = this.createTransform(topLeft, topRight, bottomLeft, alignmentPattern, dimension);

        let bits = this.sampleGrid(this.image, transform, dimension);

        let points;
        if (alignmentPattern == null) {
            points = [bottomLeft, topLeft, topRight];
        }
        else {
            points = [bottomLeft, topLeft, topRight, alignmentPattern];
        }
        return new DetectorResult(bits, points);
    }

    detect() {
        let info = new FinderPatternFinder().findFinderPattern(this.image);

        return this.processFinderPatternInfo(info);
    }

}