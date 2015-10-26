// https://github.com/DevExpress/DevExtreme-Data-LINQ
// Copyright (c) Developer Express Inc.

(function($, DX) {
    function createDataSource(options) {
        var loadUrl = options.loadUrl,
            updateUrl = options.updateUrl,
            insertUrl = options.insertUrl,
            deleteUrl = options.deleteUrl,
            config = { };

        config.key = options.key;

        config.load = function(loadOptions) {
            var d = new $.Deferred();

            $.getJSON(loadUrl, loadOptionsToActionParams(loadOptions))
                .done(function(res) {
                    if($.isArray(res))
                        d.resolve(res);
                    else
                        d.resolve(res.data, { totalCount: res.totalCount })
                });

            return d.promise();
        };

        config.totalCount = function(loadOptions) {
            return $.getJSON(loadUrl, loadOptionsToActionParams(loadOptions, true))
        };

        if(updateUrl) {
            config.update = function(key, values) {
                return $.ajax(updateUrl, {
                    method: options.updateMethod || "put",
                    data: {
                        key: serializeKey(key),
                        values: JSON.stringify(values)
                    }
                });
            };
        }

        if(insertUrl) {
            config.insert = function(values) {
                return $.ajax(insertUrl, {
                    method: options.insertMethod || "post",
                    data: { values: JSON.stringify(values) }
                });
            };
        }

        if(deleteUrl) {
            config.remove = function(key) {
                return $.ajax(deleteUrl, {
                    method: options.deleteMethod || "delete",
                    data: { key: serializeKey(key) }
                });
            };
        }
        
        return config;
    }

    function loadOptionsToActionParams(options, isCountQuery) {
        var result = {
            requireTotalCount: options.requireTotalCount,
            isCountQuery: isCountQuery,
            skip: options.skip,
            take: options.take,
        };

        if($.isArray(options.sort))
            result.sort = JSON.stringify(options.sort);

        if($.isArray(options.filter))
            result.filter = JSON.stringify(options.filter);

        return result;
    }

    function serializeKey(key) {
        if(typeof key === "object")
            return JSON.stringify(key);

        return key;
    }

    $.extend(DX.data, {
        linq: { createDataSource: createDataSource }
    });

})(jQuery, DevExpress);