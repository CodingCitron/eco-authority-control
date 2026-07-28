/* 전거관리 시스템 - 그리드 헤더 정렬 (오름차순/내림차순 토글) */
(function () {
    function getCellText(row, idx) {
        return row.children[idx] ? row.children[idx].innerText.trim() : '';
    }

    function compareValues(a, b) {
        var na = parseFloat(a.replace(/,/g, ''));
        var nb = parseFloat(b.replace(/,/g, ''));
        if (a !== '' && b !== '' && !isNaN(na) && !isNaN(nb)) {
            return na - nb;
        }
        return a.localeCompare(b, 'ko');
    }

    function makeSortable(table) {
        if (!table || table.dataset.sortableBound === 'true') return;
        var thead = table.querySelector('thead');
        var tbody = table.querySelector('tbody');
        if (!thead || !tbody) return;
        var headerRow = thead.rows[thead.rows.length - 1];
        if (!headerRow) return;

        table.dataset.sortableBound = 'true';

        Array.prototype.forEach.call(headerRow.cells, function (th, idx) {
            if (!th.textContent.trim()) return;
            if (th.classList.contains('no-sort')) return;
            th.classList.add('sortable-th');
            th.setAttribute('role', 'button');
            th.setAttribute('tabindex', '0');

            var indicator = document.createElement('span');
            indicator.className = 'sort-indicator';
            indicator.textContent = '⇅';
            th.appendChild(indicator);

            function doSort() {
                var asc = th.dataset.sortDir !== 'asc';

                Array.prototype.forEach.call(headerRow.cells, function (other) {
                    other.dataset.sortDir = '';
                    var ind = other.querySelector('.sort-indicator');
                    if (ind) ind.textContent = '⇅';
                });
                th.dataset.sortDir = asc ? 'asc' : 'desc';
                indicator.textContent = asc ? '▲' : '▼';

                var headerColCount = headerRow.cells.length;
                var rows = Array.prototype.slice.call(tbody.rows);
                var sortableRows = rows.filter(function (r) { return r.cells.length === headerColCount; });
                var pinnedRows = rows.filter(function (r) { return r.cells.length !== headerColCount; });

                sortableRows.sort(function (r1, r2) {
                    var cmp = compareValues(getCellText(r1, idx), getCellText(r2, idx));
                    return asc ? cmp : -cmp;
                });

                sortableRows.forEach(function (r) { tbody.appendChild(r); });
                pinnedRows.forEach(function (r) { tbody.appendChild(r); });
            }

            th.addEventListener('click', doSort);
            th.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    doSort();
                }
            });
        });
    }

    function initAll(root) {
        var scope = root || document;
        var tables = scope.querySelectorAll('main table');
        Array.prototype.forEach.call(tables, function (t) {
            if (t.closest('.modal')) return;
            makeSortable(t);
        });
    }

    document.addEventListener('DOMContentLoaded', function () { initAll(document); });

    window.gridSort = { makeSortable: makeSortable, initAll: initAll };
})();
