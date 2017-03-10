alter table  table_name add partition part_key_column_029 values less than (to_date('2029-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS','NLS_CALENDAR=GREGORIAN'))

　　　　　　　tablespace tablespace_name

　　　　　　　pctfree 10

　　　　　　  initrans 1

　　　　　　　maxtrans255,

......,

alter table  table_name add partition part_key_column_049 values less than (to_date('2049-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS','NLS_CALENDAR=GREGORIAN'))

　　　　　　　tablespace tablespace_name

　　　　　　　pctfree 10

　　　　　　  initrans 1

　　　　　　　maxtrans255,