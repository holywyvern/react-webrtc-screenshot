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
class DataMask000 {

	unmaskBitMatrix(bits, dimension) {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (this.isMasked(i, j)) {
					bits.flip(j, i);
				}
			}
		}
	}

	isMasked(i, j) {
		return ((i + j) & 0x01) == 0;
	}

}


class DataMask001 {
	unmaskBitMatrix(bits, dimension) {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (this.isMasked(i, j)) {
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked(i, j) {
		return (i & 0x01) == 0;
	}
}

class DataMask010 {
	unmaskBitMatrix(bits, dimension) {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (this.isMasked(i, j)) {
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked(i, j) {
		return j % 3 == 0;
	}
}

class DataMask011 {
	unmaskBitMatrix(bits, dimension) {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (this.isMasked(i, j)) {
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked(i, j) {
		return (i + j) % 3 == 0;
	}
}

class DataMask100 {
	unmaskBitMatrix(bits, dimension) {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (this.isMasked(i, j)) {
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked(i, j) {
		return (((URShift(i, 1)) + (j / 3)) & 0x01) == 0;
	}
}

class DataMask101 {
	unmaskBitMatrix(bits, dimension) {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (this.isMasked(i, j)) {
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked(i, j) {
		var temp = i * j;
		return (temp & 0x01) + (temp % 3) == 0;
	}
}

class DataMask110 {
	unmaskBitMatrix(bits, dimension) {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (this.isMasked(i, j)) {
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked(i, j) {
		var temp = i * j;
		return (((temp & 0x01) + (temp % 3)) & 0x01) == 0;
	}
}
class DataMask111 {
	unmaskBitMatrix(bits, dimension) {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				if (this.isMasked(i, j)) {
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked(i, j) {
		return ((((i + j) & 0x01) + ((i * j) % 3)) & 0x01) == 0;
	}
}




export const DataMask = {

	forReference(reference) {
		if (reference < 0 || reference > 7) {
			throw "Reference must be between 0 and 7";
		}
		return this.DATA_MASKS[reference];
	},

	DATA_MASKS: [	
		new DataMask000(), new DataMask001(), new DataMask010(), new DataMask011(), 
		new DataMask100(), new DataMask101(), new DataMask110(), new DataMask111()
	]

};

