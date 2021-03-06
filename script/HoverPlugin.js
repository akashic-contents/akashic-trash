"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ホバー機能を提供するプラグイン。
 */
var HoverPlugin = (function () {
    function HoverPlugin(game, view, option) {
        if (option === void 0) { option = {}; }
        this.game = game;
        this.view = view.view;
        this.beforeHover = null;
        this.operationTrigger = new g.Trigger();
        this._cursor = option.cursor || "pointer";
        this._showTooltip = !!option.showTooltip;
        this._getScale = view.getScale ? function () { return view.getScale(); } : null;
        this._onMouseMove_bound = this._onMouseMove.bind(this);
        this._onMouseOut_bound = this._onMouseOut.bind(this);
    }
    HoverPlugin.isSupported = function () {
        return (typeof document !== "undefined") && (typeof document.addEventListener === "function");
    };
    ;
    HoverPlugin.prototype.start = function () {
        this.view.addEventListener("mousemove", this._onMouseMove_bound, false);
        this.view.addEventListener("mouseout", this._onMouseOut_bound, false);
        return true;
    };
    HoverPlugin.prototype.stop = function () {
        this.view.removeEventListener("mousemove", this._onMouseMove_bound, false);
        this.view.removeEventListener("mouseout", this._onMouseOut_bound, false);
    };
    HoverPlugin.prototype._onMouseMove = function (e) {
        var rect = this.view.getBoundingClientRect();
        var positionX = rect.left + window.pageXOffset;
        var positionY = rect.top + window.pageYOffset;
        var offsetX = e.pageX - positionX;
        var offsetY = e.pageY - positionY;
        var scale = { x: 1, y: 1 };
        if (this._getScale) {
            scale = this._getScale();
        }
        var point = { x: offsetX / scale.x, y: offsetY / scale.y };
        var target = this.game.scene().findPointSourceByPoint(point).target;
        if (target && target.hoverable) {
            if (target !== this.beforeHover) {
                if (this.beforeHover && this.beforeHover.hoverable) {
                    this._onUnhovered(target);
                }
                this._onHovered(target);
            }
            this.beforeHover = target;
        }
        else if (this.beforeHover) {
            this._onUnhovered(this.beforeHover);
        }
    };
    HoverPlugin.prototype._onHovered = function (target) {
        if (target.hoverable) {
            this.view.style.cursor = target.cursor ? target.cursor : this._cursor;
            if (this._showTooltip && target.title) {
                this.view.setAttribute("title", target.title);
            }
            target.hovered.fire();
        }
    };
    HoverPlugin.prototype._onUnhovered = function (target) {
        this.view.style.cursor = "auto";
        if (this.beforeHover.unhovered) {
            this.beforeHover.unhovered.fire();
            if (this._showTooltip) {
                this.view.removeAttribute("title");
            }
        }
        this.beforeHover = null;
    };
    HoverPlugin.prototype._onMouseOut = function () {
        if (this.beforeHover)
            this._onUnhovered(this.beforeHover);
    };
    return HoverPlugin;
}());
exports.HoverPlugin = HoverPlugin;
module.exports = HoverPlugin;
