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

import WlinkPacket from "./IOSP/WlinkPacket.js";
import {PacketType} from "./PacketType.js";

/**
 * AudioPacket Packet
 */
class AudioPacket extends WlinkPacket {
    constructor(payload) {
        super();
        this.lopServerVocode = payload?.LopServerVocode;
        this.data = payload?.Data ? Buffer.from(payload.Data, 'base64') : null;
        this.voiceChannel = payload?.VoiceChannel || null;
        this.audioMode = payload.AudioMode;
        this.site = payload.Site || null;
    }

    static packetType = PacketType.AUDIO_DATA;

    toString() {
        return `AudioPacket: srcId=${this.voiceChannel.SrcId}, dstId=${this.voiceChannel.DstId} channel=${this.voiceChannel.Frequency}`;
    }
}

export default AudioPacket;