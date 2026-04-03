--
-- PostgreSQL database dump
--

\restrict LivefXolIQjbYFAX7UzkyiVzrrRsvEDJIJ6mIVaDGOBnLbUdtCVdhrJYv8iuNH7

-- Dumped from database version 17.6 (Debian 17.6-2.pgdg12+1)
-- Dumped by pg_dump version 18.3 (Debian 18.3-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: graduation_work_db_63nj_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO graduation_work_db_63nj_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO graduation_work_db_63nj_user;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE TABLE public.locations (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    lat numeric(10,6) NOT NULL,
    lng numeric(10,6) NOT NULL,
    address character varying NOT NULL,
    name character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.locations OWNER TO graduation_work_db_63nj_user;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE SEQUENCE public.locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO graduation_work_db_63nj_user;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    save_route_id bigint NOT NULL,
    notify_at timestamp(6) without time zone NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    send_to integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.notifications OWNER TO graduation_work_db_63nj_user;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO graduation_work_db_63nj_user;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: save_routes; Type: TABLE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE TABLE public.save_routes (
    id bigint NOT NULL,
    name character varying,
    start_point jsonb,
    end_point jsonb,
    waypoints jsonb,
    travel_mode character varying,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    execution_date date,
    total_distance integer,
    total_duration integer,
    start_time time without time zone
);


ALTER TABLE public.save_routes OWNER TO graduation_work_db_63nj_user;

--
-- Name: save_routes_id_seq; Type: SEQUENCE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE SEQUENCE public.save_routes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.save_routes_id_seq OWNER TO graduation_work_db_63nj_user;

--
-- Name: save_routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER SEQUENCE public.save_routes_id_seq OWNED BY public.save_routes.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO graduation_work_db_63nj_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp(6) without time zone,
    remember_created_at timestamp(6) without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    provider character varying,
    line_login_uid character varying,
    name character varying
);


ALTER TABLE public.users OWNER TO graduation_work_db_63nj_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO graduation_work_db_63nj_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: save_routes id; Type: DEFAULT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.save_routes ALTER COLUMN id SET DEFAULT nextval('public.save_routes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: ar_internal_metadata; Type: TABLE DATA; Schema: public; Owner: graduation_work_db_63nj_user
--

COPY public.ar_internal_metadata (key, value, created_at, updated_at) FROM stdin;
environment	production	2025-08-06 04:17:37.482483	2025-08-06 04:17:37.48249
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: graduation_work_db_63nj_user
--

COPY public.locations (id, user_id, lat, lng, address, name, created_at, updated_at) FROM stdin;
1	6	35.679283	139.771392	{"p":"GAmjmjcdipcJmUJ8cR84dA13twoz5X4fgE045LGKYEp6bv8rvVPmzoVRqjVRnirZaddW25eHlG0fs8trib2aNcY8kbYEjnqKQpFZrXobbMuuyg+mctYizA==","h":{"iv":"p59DArzRnST+nIqa","at":"GNMtJNtP1z04iSOxelfdlQ=="}}	お気に入り	2025-12-24 11:47:20.551162	2025-12-24 11:47:20.551162
2	9	35.681849	139.767830	{"p":"oB4/52ytWdxpSKo0VmkknETxJhha156C/ebKpxMdw59nT7lHo3dtr88vWxRFILJ9SaWTWrrMvxGWhR+dmhGPSSOMYtTMeOeS3T+dQEx5c/ue","h":{"iv":"tg18zSqc82M9vygh","at":"4aBYzmM2F5rtfWSqf1zf2A=="}}	東京駅	2025-12-26 05:38:14.83834	2025-12-26 05:38:14.83834
3	9	35.685153	139.763903	{"p":"S5H8MCQbaRAjMEUEimAt0NVDXe7BO4xxwhJ27irZrwAe4fZ9g3iZoDCu8QPGkCcnD79eIzRuTkJGclMUsMgObTT44JO1","h":{"iv":"DtTK9UwyL/CAB9s+","at":"BuVuA+/M9XPxzxaCnekJmA=="}}	cat	2025-12-26 05:47:04.74595	2025-12-26 05:47:04.74595
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: graduation_work_db_63nj_user
--

COPY public.notifications (id, user_id, save_route_id, notify_at, status, created_at, updated_at, send_to) FROM stdin;
3	6	3	2025-12-15 11:45:00	sent	2025-12-15 11:43:33.730226	2025-12-15 11:45:55.983841	0
5	6	5	2025-12-24 05:03:00	sent	2025-12-24 05:09:35.136179	2025-12-24 05:10:35.283538	0
6	6	6	2025-12-24 06:31:00	sent	2025-12-24 06:37:05.459039	2025-12-24 06:37:24.496047	0
7	6	7	2025-12-24 07:45:00	sent	2025-12-24 07:50:39.751376	2025-12-24 07:51:17.729689	0
8	6	8	2025-12-24 07:55:00	sent	2025-12-24 07:52:15.63734	2025-12-24 07:55:17.329364	0
12	8	14	2025-12-26 02:42:00	sent	2025-12-26 02:47:49.03158	2025-12-26 02:48:12.933485	0
13	7	18	2026-03-22 08:16:00	sent	2026-03-22 08:21:51.646663	2026-03-22 08:22:10.686023	1
\.


--
-- Data for Name: save_routes; Type: TABLE DATA; Schema: public; Owner: graduation_work_db_63nj_user
--

COPY public.save_routes (id, name, start_point, end_point, waypoints, travel_mode, user_id, created_at, updated_at, execution_date, total_distance, total_duration, start_time) FROM stdin;
3	2025-12-15のルート	{"lat": 33.867358222073655, "lng": 130.9015145496344, "name": "現在地"}	{"mainPoint": {"lat": 33.8869679, "lng": 130.88257579999998, "name": "小倉駅"}, "arrival_time": "2025-12-15T12:36:48.000Z"}	[]	walking	6	2025-12-15 11:43:12.770621	2025-12-15 11:43:28.563167	2025-12-15	3353	2808	11:50:00
5	テスト用ルート	{"lat": 33.86732980378275, "lng": 130.9014721045073, "name": "現在地"}	{"mainPoint": {"lat": 33.8869679, "lng": 130.88257579999998, "name": "小倉駅"}, "arrival_time": "2025-12-24T05:21:20.000Z"}	[]	driving	6	2025-12-24 05:09:01.250244	2025-12-24 05:09:24.718249	2025-12-24	3770	800	05:08:00
6	2025-12-24のルート	{"lat": 33.8673343668885, "lng": 130.90151977530476, "name": "現在地"}	{"mainPoint": {"lat": 33.8869679, "lng": 130.88257579999998, "name": "小倉駅"}, "arrival_time": "2025-12-24T06:49:21.000Z"}	[]	driving	6	2025-12-24 06:36:42.104114	2025-12-24 06:36:54.712585	2025-12-24	3774	801	06:36:00
7	2025-12-24テストのルート	{"lat": 33.86724003947847, "lng": 130.9013747521791, "name": "現在地"}	{"mainPoint": {"lat": 33.8706105, "lng": 130.8644363, "name": "南小倉駅"}, "arrival_time": "2025-12-24T08:44:15.000Z"}	[]	walking	6	2025-12-24 07:50:17.643536	2025-12-24 07:50:34.627396	2025-12-24	3883	3255	07:50:00
8	テストルート	{"lat": 33.867235927930736, "lng": 130.9014592134455, "name": "現在地"}	{"mainPoint": {"lat": 33.86956630042175, "lng": 130.89390611285958, "name": "日本、〒802-0044 福岡県北九州市小倉北区熊本２丁目７−１７"}, "arrival_time": "2025-12-24T08:12:11.000Z"}	[]	walking	6	2025-12-24 07:51:47.867481	2025-12-24 07:52:06.866926	2025-12-24	926	731	08:00:00
14	2025-12-26のルート	{"lat": 35.681299599999996, "lng": 139.76706579999998, "name": "東京駅"}	{"mainPoint": {"lat": 35.6585805, "lng": 139.7454329, "name": "東京タワー"}, "arrival_time": "2025-12-26T03:41:09.000Z"}	[]	walking	8	2025-12-26 02:47:29.210157	2025-12-26 02:47:38.341268	2025-12-26	3742	3249	02:47:00
15	2026-03-22のルート	{"lat": 33.88541712793991, "lng": 130.875351427653, "name": "現在地"}	{"mainPoint": {"lat": 33.8730403, "lng": 130.8122235, "name": "トミーヒルフィガー ジ·アウトレット北九州店"}, "arrival_time": "2026-03-22T02:26:09.000Z"}	[]	driving	7	2026-03-22 02:09:31.250021	2026-03-22 02:09:31.250021	\N	7101	1029	02:09:00
16	2026-03-22のルート	{"lat": 33.885413286899116, "lng": 130.87527241369884, "name": "現在地"}	{"mainPoint": {"lat": 33.8706105, "lng": 130.8644363, "name": "南小倉駅"}, "arrival_time": "2026-03-22T02:22:36.000Z"}	[]	driving	7	2026-03-22 02:14:36.836977	2026-03-22 02:14:36.836977	\N	2264	516	02:14:00
17	2026-03-22のルート	{"lat": 33.86730133834575, "lng": 130.90147168275897, "name": "現在地"}	{"mainPoint": {"lat": 33.8706105, "lng": 130.8644363, "name": "南小倉駅"}, "arrival_time": "2026-03-22T08:48:20.000Z"}	[]	walking	7	2026-03-22 07:54:33.762797	2026-03-22 07:54:33.762797	\N	3890	3260	07:54:00
18	西小倉駅へのルート	{"lat": 33.86729049966262, "lng": 130.9015045165034, "name": "現在地"}	{"mainPoint": {"lat": 33.888511, "lng": 130.87391, "name": "西小倉駅"}, "arrival_time": "2026-03-22T08:35:55.000Z"}	[]	driving	7	2026-03-22 08:21:23.56585	2026-03-22 08:21:45.34994	2026-03-22	4705	895	08:21:00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: graduation_work_db_63nj_user
--

COPY public.schema_migrations (version) FROM stdin;
20250801001252
20250801093645
20250801110727
20250803021438
20250803025707
20250803031255
20250803031600
20250803032432
20250803033004
20250803074412
20250803082636
20250803083526
20250803084835
20251017121221
20251020041727
20251025064415
20251108005238
20251124232643
20251125133614
20251126045842
20251130072444
20251201030036
20251201032557
20251204133528
20251205025244
20251205081553
20251211102059
20260124060249
20260319004226
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: graduation_work_db_63nj_user
--

COPY public.users (id, email, encrypted_password, reset_password_token, reset_password_sent_at, remember_created_at, created_at, updated_at, provider, line_login_uid, name) FROM stdin;
3		$2a$12$Kw2/8LAzbqKN/NaGC66AReRPzPrpkFYpBAV2V6ZW9ljkiYbEq1dX2	\N	\N	\N	2025-10-23 07:33:02.299878	2025-10-23 07:33:02.299878	line	Ueabc932e9efc2155ccb9680fdc177313	森川 千乃
4	hoge@example.com	$2a$12$Lgoz6udcmUBgi.iqrsfgpe2fP17t9As/KRAQUVh2Sd2TjIU0SvU.y	\N	\N	\N	2025-10-23 08:13:50.351518	2025-10-23 08:13:50.351518	\N	\N	hoge
5	test@sample.com	$2a$12$1GvzhMrxa0HO/unKZWtTluZtoVD6RFUi5wXhb7ROpKf/YOF/4JR5C	\N	\N	\N	2025-11-05 22:39:45.594584	2025-11-05 22:39:45.594584	\N	\N	Test
7	ueabc932e9efc2155ccb9680fdc177313-line@example.com	$2a$12$trk13EEczDqLOjlYyn/oW.jQqy6uYrAHrR1uq4dHsQxfFFE9vxgLy	\N	\N	\N	2025-12-23 03:37:37.922943	2025-12-23 03:37:37.922943	line	{"p":"RMexiDuwCI6eHA6x8/GzA1yDGMqjQIGETWrtmGZIf+Lp","h":{"iv":"auZf8C1C0P3TwaIU","at":"ZjvlrbWF52pVKzNkF9TkDw=="}}	森川 千乃
6	reveluv.chino1205@icloud.com	$2a$12$0Y4NnmgavrrkHSnuYgfWm.g8dvwS4u9/MdNnM6mpG8jWRHGMLp/nm	\N	\N	\N	2025-11-08 07:41:13.205087	2025-12-24 07:59:21.290213	\N	\N	ちの
8	sketto@example.com	$2a$12$YmvI4nVCt3LXmSabA.cpj.xcjmo8js0FJkUwyPe0zZM8krlHO806q	\N	\N	\N	2025-12-26 01:02:48.08127	2025-12-26 01:02:48.08127	\N	\N	Sketto
9	hoge2@example.com	$2a$12$/PtmqRqHaMxbOKdxPZzkCe60Kn2TtXDf5iyR7sV6m9WF3aL6LCjTi	\N	\N	\N	2025-12-26 05:37:49.354888	2025-12-26 05:37:49.354888	\N	\N	hoge
\.


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: graduation_work_db_63nj_user
--

SELECT pg_catalog.setval('public.locations_id_seq', 3, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: graduation_work_db_63nj_user
--

SELECT pg_catalog.setval('public.notifications_id_seq', 13, true);


--
-- Name: save_routes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: graduation_work_db_63nj_user
--

SELECT pg_catalog.setval('public.save_routes_id_seq', 18, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: graduation_work_db_63nj_user
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: save_routes save_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.save_routes
    ADD CONSTRAINT save_routes_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_locations_on_user_id; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE INDEX index_locations_on_user_id ON public.locations USING btree (user_id);


--
-- Name: index_locations_on_user_id_and_name; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE UNIQUE INDEX index_locations_on_user_id_and_name ON public.locations USING btree (user_id, name);


--
-- Name: index_notifications_on_notify_at_and_status; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE INDEX index_notifications_on_notify_at_and_status ON public.notifications USING btree (notify_at, status);


--
-- Name: index_notifications_on_save_route_id; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE INDEX index_notifications_on_save_route_id ON public.notifications USING btree (save_route_id);


--
-- Name: index_notifications_on_user_id; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE INDEX index_notifications_on_user_id ON public.notifications USING btree (user_id);


--
-- Name: index_save_routes_on_user_id; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE INDEX index_save_routes_on_user_id ON public.save_routes USING btree (user_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);


--
-- Name: index_users_on_provider_and_line_login_uid; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE UNIQUE INDEX index_users_on_provider_and_line_login_uid ON public.users USING btree (provider, line_login_uid);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: graduation_work_db_63nj_user
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON public.users USING btree (reset_password_token);


--
-- Name: notifications fk_rails_2deff5e272; Type: FK CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_rails_2deff5e272 FOREIGN KEY (save_route_id) REFERENCES public.save_routes(id);


--
-- Name: locations fk_rails_5e107925c6; Type: FK CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT fk_rails_5e107925c6 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications fk_rails_b080fb4855; Type: FK CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_rails_b080fb4855 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: save_routes fk_rails_d62ed8cd9d; Type: FK CONSTRAINT; Schema: public; Owner: graduation_work_db_63nj_user
--

ALTER TABLE ONLY public.save_routes
    ADD CONSTRAINT fk_rails_d62ed8cd9d FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO graduation_work_db_63nj_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO graduation_work_db_63nj_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO graduation_work_db_63nj_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO graduation_work_db_63nj_user;


--
-- PostgreSQL database dump complete
--

\unrestrict LivefXolIQjbYFAX7UzkyiVzrrRsvEDJIJ6mIVaDGOBnLbUdtCVdhrJYv8iuNH7

