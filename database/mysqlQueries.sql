-- CandidateInfo table temporary insert query * 11
use galaxytnt; 
INSERT INTO candidate_info(candidate_id, first_name, last_name, contact_no, gender, address, state, country, pincode, email, origin, status, DOE) VALUES (uuid(), "temp", "temp", '123123123123123123', 'Male', 'adsf-123--asdfasdfasdfasdfadsf', 'asdf', 'Adsfsdf', '123123123','asdf@asdf.com' ,'online', 'A', curdate());
SELECT * FROM candidate_info;