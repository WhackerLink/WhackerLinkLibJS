/**
 * WhackerLink - WhackerLinkLibJS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright (C) 2025 Caleb, K4PHP
 */

import WlinkPacket from '../WlinkPacket.js';
import { PacketType } from '../../PacketType.js';

/**
 * U_REG_REQ Packet
 */
class U_REG_REQ extends WlinkPacket {
    constructor(srcId, sysId, wacn, site) {
        super();
        this.srcId = srcId;
        this.sysId = sysId;
        this.wacn = wacn;
        this.site = site;
    }

    static packetType = PacketType.U_REG_REQ;

    toString() {
        return `U_REG_REQ, srcId: ${this.srcId}, sysId: ${this.sysId}`;
    }
}

export default U_REG_REQ;
