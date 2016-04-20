/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global define*/
define([
    'underscore',
    'backbone',
], function (_, Backbone) {

    return Backbone.Model.extend({
        defaults: {
            isOpen: false,
            activeMenu: undefined
        },
        isOpen: function(){
            return this.get('isOpen');
        },
        getActiveMenu: function(){
            return this.get('activeMenu');
        },
        activate: function(menuName){
            this.set({
                isOpen: true,
                activeMenu: menuName
            });
        },
        close: function(){
            this.set({
                isOpen: false,
                activeMenu: undefined
            });
        }
    });
});