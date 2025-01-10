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

import WebSocket from 'ws';
import { PacketType } from './PacketType.js';
import U_REG_RSP from "./IOSP/WlinkPackets/U_REG_RSP.js";
import AudioPacket from "./AudioPacket.js";

/**
 * Peer class for managing a WhackerLink peer instance.
 */
class Peer {
    constructor() {
        this.socket = null;
        this.eventHandlers = {};
        this.reconnectInterval = 5000; // Reconnect interval in ms
        this.reconnectTimeout = null;
        this.address = null;
        this.port = null;
    }

    /**
     * Connects to a WhackerLink master.
     * @param {string} address - The server address.
     * @param {number} port - The server port.
     */
    connect(address, port) {
        this.address = address;
        this.port = port;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.warn('Already connected.');
            return;
        }

        this._clearReconnectTimeout();
        this._connectToServer();
    }

    /**
     * Attempts to connect to the server.
     * @private
     */
    _connectToServer() {
        this.socket = new WebSocket(`ws://${this.address}:${this.port}/client`);

        this.socket.on('open', () => {
            this._emit('open');
            this._clearReconnectTimeout();
        });

        this.socket.on('close', () => {
            this._emit('close');
            this._scheduleReconnect();
        });

        this.socket.on('message', (data) => this._handleMessage(data));

        this.socket.on('error', (err) => {
            this._emit('error', err);
            this._scheduleReconnect();
        });
    }

    /**
     * Disconnects from the WhackerLink master.
     */
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this._clearReconnectTimeout();
    }

    /**
     * Sends a message to the WhackerLink master.
     * @param {Object} message - The message to send.
     */
    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn('Cannot send message. Master not connected');
        }
    }

    /**
     * Registers an event handler.
     * @param {string} event - The event name.
     * @param {Function} handler - The event handler.
     */
    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }

    /**
     * Emits an event to all registered handlers.
     * @param {string} event - The event name.
     * @param {...any} args - Arguments to pass to the handlers.
     */
    _emit(event, ...args) {
        if (this.eventHandlers[event]) {
            for (const handler of this.eventHandlers[event]) {
                handler(...args);
            }
        }
    }

    /**
     * Handles incoming messages and emits appropriate events.
     * @param {string} data - The message data.
     */
    _handleMessage(data) {
        try {
            const parsed = JSON.parse(data);
            const type = Number(parsed.type);
            const payload = parsed.data;

            // TODO: Properly handle all these packet types
            switch (type) {
                case PacketType.U_REG_RSP:
                    this._emit('unitRegistrationResponse', new U_REG_RSP(payload));
                    break;
                case PacketType.U_DE_REG_RSP:
                    this._emit('unitDeRegistrationResponse', payload);
                    break;
                case PacketType.GRP_AFF_RSP:
                    this._emit('groupAffiliationResponse', payload);
                    break;
                case PacketType.GRP_VCH_RSP:
                    this._emit('voiceChannelResponse', payload);
                    break;
                case PacketType.AFF_UPDATE:
                    this._emit('affiliationUpdate', payload);
                    break;
                case PacketType.GRP_VCH_RLS:
                    this._emit('voiceChannelRelease', payload);
                    break;
                case PacketType.EMRG_ALRM_RSP:
                    this._emit('emergencyAlarmResponse', payload);
                    break;
                case PacketType.CALL_ALRT:
                    this._emit('callAlert', payload);
                    break;
                case PacketType.AUDIO_DATA:
                    this._emit('audioData', new AudioPacket(payload));
                    break;
                case PacketType.LOC_BCAST:
                    break; // no use for these really at the moment, just annoying to log
                default:
                    console.warn('Unknown packet type:', type);
            }
        } catch (err) {
            console.error('Failed to handle message:', err);
        }
    }

    /**
     * Schedules a reconnect attempt.
     * Keeps retrying indefinitely until a connection is established.
     * @private
     */
    _scheduleReconnect() {
        if (!this.reconnectTimeout) {
            this.reconnectTimeout = setTimeout(() => {
                console.log(`Attempting to reconnect to ${this.address}:${this.port}...`);
                this._connectToServer();

                this.reconnectTimeout = null;

                if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                    this._scheduleReconnect();
                }
            }, this.reconnectInterval);
        }
    }

    /**
     * Clears the reconnect timeout.
     * @private
     */
    _clearReconnectTimeout() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }
}

export { Peer };