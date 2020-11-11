-- CandidateInfo table temporary insert query * 11
use galaxytnt; 
INSERT INTO candidate_info(candidate_id, first_name, last_name, contact_no, gender, address, state, country, pincode, email, origin, status, DOE) VALUES (uuid(), "temp", "temp", '123123123123123123', 'Male', 'adsf-123--asdfasdfasdfasdfadsf', 'asdf', 'Adsfsdf', '123123123','asdf@asdf.com' ,'online', 'A', curdate());
SELECT * FROM candidate_info;

--spec_list temporary insert
use galaxytnt; 
INSERT INTO spec_list(spec_id, 	specialization) VALUES (uuid(), 'Mechanical Helper'), (uuid(), 'Electrical Helper'), (uuid(), 'Computer Helper'), (uuid(), 'Damn Daniel'), (uuid(), 'Automobile Engineer');

-- insert in the candidate_spec_junc --
-- change the spec_id and cadidate_id with the one created by the uuid() function
use galaxytnt;
insert into candidate_spec_junc values ('109f877a-189d-11eb-8592-02f58c264cb2', 'bdfdd3c7-20c9-11eb-92e7-02fef61beff6', 2), ('109f877a-189d-11eb-8592-02f58c264cb2', 'bdfe74d4-20c9-11eb-92e7-02fef61beff6', 3);
insert into candidate_spec_junc values ('14042c8b-189d-11eb-8592-02f58c264cb2', 'bdfdd3c7-20c9-11eb-92e7-02fef61beff6', 2), ('14042c8b-189d-11eb-8592-02f58c264cb2', 'bdfe74d4-20c9-11eb-92e7-02fef61beff6', 3);
insert into candidate_spec_junc values ('16549438-189d-11eb-8592-02f58c264cb2', 'bdfdd3c7-20c9-11eb-92e7-02fef61beff6', 2), ('16549438-189d-11eb-8592-02f58c264cb2', 'bdfe74d4-20c9-11eb-92e7-02fef61beff6', 3);

-- gather specialization of an individuals --- below query is for candidate 109f877a-189d-11eb-8592-02f58c264cb2
select * from spec_list, candidate_spec_junc where spec_list.spec_id = candidate_spec_junc.spec_id AND candidate_id = '109f877a-189d-11eb-8592-02f58c264cb2';