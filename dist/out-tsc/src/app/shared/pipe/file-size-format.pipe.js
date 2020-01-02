import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
var FILE_SIZE_UNITS_LONG = [
    'Bytes',
    'Kilobytes',
    'Megabytes',
    'Gigabytes',
    'Pettabytes',
    'Exabytes',
    'Zettabytes',
    'Yottabytes'
];
var FileSizeFormatPipe = /** @class */ (function () {
    function FileSizeFormatPipe() {
    }
    FileSizeFormatPipe.forRoot = function () {
        throw new Error('Method not implemented.');
    };
    FileSizeFormatPipe.prototype.transform = function (sizeInBytes, longForm) {
        var units = longForm ? FILE_SIZE_UNITS_LONG : FILE_SIZE_UNITS;
        var power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
        power = Math.min(power, units.length - 1);
        var size = sizeInBytes / Math.pow(1024, power); // size in new units
        var formattedSize = Math.round(size * 100) / 100; // keep up to 2 decimals
        var unit = units[power];
        return formattedSize + " " + unit;
    };
    FileSizeFormatPipe = tslib_1.__decorate([
        Pipe({
            name: 'fileSizePipe'
        })
    ], FileSizeFormatPipe);
    return FileSizeFormatPipe;
}());
export { FileSizeFormatPipe };
//# sourceMappingURL=file-size-format.pipe.js.map