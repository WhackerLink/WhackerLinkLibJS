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
 * U_REG_RSP Packet
 */
class U_REG_RSP extends WlinkPacket {
    constructor(payload) {
        super();
        this.srcId = payload?.SrcId || null;
        this.sysId = payload?.SysId || null;
        this.wacn = payload?.Wacn || null;
        this.site = payload?.Site || null;
        this.status = payload?.Status || null;
        this.packetType = PacketType.U_REG_RSP;
    }

    static packetType = PacketType.U_REG_RSP;

    toString() {
        return `U_REG_RSP: srcId=${this.srcId}, sysId=${this.sysId}, wacn=${this.wacn}, status=${this.status}`;
    }
}

export default U_REG_RSP;