define(["require", "exports", "@syncfusion/ej2-schedule", "./datasource", "@syncfusion/ej2-base"], function (require, exports, ej2_schedule_1, datasource_1, ej2_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ej2_schedule_1.Schedule.Inject(ej2_schedule_1.Day);
    var isReadOnly = function (endDate) {
        return (endDate < new Date(2018, 6, 31, 0, 0));
    };
    var data = ej2_base_1.extend([], datasource_1.roomData, null, true);
    var scheduleOptions = {
        width: '100%',
        height: '850px',
        currentView: "Day",
        selectedDate: new Date(2018, 6, 31),
        resourceHeaderTemplate: '#resourceTemplate',
        showWeekend: false,
        group: {
            resources: ['Rooms'],
            byDate: true,
            enableCompactView: false,
            allowGroupEdit: true
        },
        workHours: { start: '08:00' },
        resources: [{
                field: 'RoomId', title: 'Select Room', name: 'Rooms', allowMultiple: true,
                dataSource: [
                    { text: 'Training room', id: 1, capacity: 20, type: 'Conference' },
                    { text: 'Conf room 1', id: 2, capacity: 7, type: 'Cabin' },
                    { text: 'Interview room 1', id: 3, capacity: 5, type: 'Cabin' },
                    { text: 'Interview room 2', id: 4, capacity: 15, type: 'Conference' },
                    { text: 'Conf room 2', id: 5, capacity: 25, type: 'Conference' }
                ],
                textField: 'text', idField: 'id'
            }],
        views: ['Day'],
        eventSettings: {
            dataSource: data,
            enableTooltip: true,
            tooltipTemplate: '#tooltipTemplate',
            fields: {
                id: 'Id',
                subject: { title: 'Summary', name: 'Subject' },
                location: { title: 'Location', name: 'Location' },
                description: { title: 'Comments', name: 'Description' },
                startTime: { title: 'From', name: 'StartTime' },
                endTime: { title: 'To', name: 'EndTime' }
            }
        },
        popupOpen: function (args) {
            var data = args.data;
            if (args.type === "QuickInfo" || args.type === "Editor" || args.type === "RecurrenceAlert" || args.type === "DeleteAlert") {
                var target = (args.type == "RecurrenceAlert" || args.type == "DeleteAlert") ? data.element[0] : args.target;
                if (!ej2_base_1.isNullOrUndefined(target) && target.classList.contains('e-work-cells')) {
                    var endDate = data.endTime;
                    var startDate = data.startTime;
                    var groupIndex = data.groupIndex;
                    if ((target.classList.contains('e-read-only-cells')) || (!scheduleObj.isSlotAvailable(startDate, endDate, groupIndex))) {
                        args.cancel = true;
                    }
                }
                else if (target.classList.contains('e-appointment') && (isReadOnly(data.EndTime) || target.classList.contains('e-lunch-break') || target.classList.contains('e-maintenance'))) {
                    args.cancel = true;
                }
            }
        },
        renderCell: function (args) {
            if (args.element.classList.contains('e-work-cells')) {
                if (args.date < new Date(2018, 6, 31, 0, 0)) {
                    args.element.setAttribute('aria-readonly', 'true');
                    args.element.classList.add('e-read-only-cells');
                }
            }
        },
        eventRendered: function (args) {
            var data = args.data;
            if (isReadOnly(data.EndTime) || data.EventType == "Lunch" || data.EventType == "Maintenance") {
                args.element.setAttribute('aria-readonly', 'true');
                args.element.classList.add('e-read-only');
            }
            if (data.EventType == "Lunch") {
                args.element.classList.add('e-lunch-break');
            }
            else if (data.EventType == "Maintenance") {
                args.element.classList.add('e-maintenance');
            }
        },
        actionBegin: function (args) {
            if (args.requestType == "eventCreate" || args.requestType == "eventChange") {
                var data_1 = args.data;
                var groupIndex = scheduleObj.eventBase.getGroupIndexFromEvent(data_1);
                if (!scheduleObj.isSlotAvailable(data_1.StartTime, data_1.EndTime, groupIndex)) {
                    args.cancel = true;
                }
            }
        }
    };
    var scheduleObj = new ej2_schedule_1.Schedule(scheduleOptions, document.getElementById('Schedule'));
    window.getRoomName = function (value) {
        return value.resourceData[value.resource.textField];
    };
    window.getRoomCapacity = function (value) {
        return value.resourceData.capacity;
    };
    window.getRoomType = function (value) {
        return value.resourceData.type;
    };
});
