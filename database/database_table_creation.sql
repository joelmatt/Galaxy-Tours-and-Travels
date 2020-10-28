# database_name: galaxytnt

use galaxytnt;
# candidate information: This table consists of all the primary information regarding the candidates
CREATE TABLE IF NOT EXISTS candidate_info(
	id INT AUTO_INCREMENT NOT NULL,
	candidate_id VARCHAR(36) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	contact_no VARCHAR(20) NOT NULL,
	gender ENUM('Male', 'Female', 'Others') NOT NULL,
	address  VARCHAR(100) NOT NULL,
	state VARCHAR(20) NOT NULL,
	country VARCHAR(20) NOT NULL, 
	pincode INT NOT NULL,
	email VARCHAR(50),
	origin ENUM('online', 'offline') NOT NULL,
	status ENUM('A', 'NA') NOT NULL, # status determines whether the person is available or Not Availabe a.k.a.  already hired.
	biodata VARCHAR(20),
	DOE DATE NOT NULL, # Date when the entry was made (use curdate() function)
	PRIMARY KEY(candidate_id),
	INDEX(id)
);

# specialization list: This table consists of all the different types of specialization offered by the candidates
CREATE TABLE IF NOT EXISTS spec_list(
	spec_id VARCHAR(36) NOT NULL,
	specialization VARCHAR(30) NOT NULL,
	PRIMARY KEY(spec_id)
);

# candidate specialization junction: This table acts as a junction between the candidiate_info table and
# spec_list table. 
CREATE TABLE IF NOT EXISTS candidate_spec_junc(
	candidate_id VARCHAR(36) NOT NULL,
	spec_id VARCHAR(36) NOT NULL,
	experience DECIMAL(4,2) NOT NULL, # e.g. 3.1, 22.5, 2.52 => years before decimal and months after decimal
	PRIMARY KEY(candidate_id, spec_id),
	FOREIGN KEY(candidate_id) REFERENCES candidate_info(candidate_id) ON DELETE CASCADE,
	FOREIGN KEY(spec_id) REFERENCES spec_list(spec_id)
);


# passport information: stores candidates passport information
CREATE TABLE IF NOT EXISTS passport_info(
	candidate_id VARCHAR(36) NOT NULL,
	passport_no VARCHAR(10) NOT NULL,
	POI VARCHAR(50) NOT NULL,	# 	place of issue (place where passport was issued)
	DOI DATE NOT NULL,
	DOE DATE NOT NULL,
	passport_copy VARCHAR(20),
	PRIMARY KEY(candidate_id), 
	FOREIGN KEY(candidate_id) REFERENCES candidate_info(candidate_id) ON DELETE CASCADE
);

# candidate proof: files locations of the acknowledgement letter and video proofs
CREATE TABLE IF NOT EXISTS candidate_proof(
	candidate_id VARCHAR(36) NOT NULL,
	acc_letter VARCHAR(20),
	speech_proof VARCHAR(20),
	PRIMARY KEY(candidate_id),
	FOREIGN KEY(candidate_id) REFERENCES candidate_info(candidate_id) ON DELETE CASCADE
);

# sponsor information: this table consists of details regarding all the sponsors
CREATE TABLE IF NOT EXISTS sponsor_info(
	sponsor_id VARCHAR(36) NOT NULL,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	state VARCHAR(20) NOT NULL,
	country VARCHAR(20) NOT NULL,
	address VARCHAR(150),
	contact VARCHAR(20),
	PRIMARY KEY(sponsor_id)
);

# visa information: visa related information for each candidate
CREATE TABLE IF NOT EXISTS visa_info(
	visa_id VARCHAR(36) NOT NULL,
	sponsor_id VARCHAR(36) NOT NULL,
	candidate_id VARCHAR(36) NOT NULL,
	pass_sub_date DATE, # passport submission date
	pass_col_date DATE, # passport collection date
	visa_no varchar(50), # visa number
	visa_copy varchar(20), # file location for the visa copy
	visa_date DATE, 
	remark varchar(100),
	PRIMARY KEY(visa_id),
	FOREIGN KEY(sponsor_id) REFERENCES sponsor_info(sponsor_id),
	FOREIGN KEY(candidate_id) REFERENCES candidate_info(candidate_id) ON DELETE CASCADE
);

# recruitment: this table consists of a list of all the recruitment drives created
CREATE TABLE IF NOT EXISTS recruitment_list(
	recruitment_id VARCHAR(36) NOT NULL,
	sponsor_id VARCHAR(36) NOT NULL,
	total_cat INT NOT NULL,
	DOC DATE NOT NULL, # Date of recruitment drive creation
	recruitment_name VARCHAR(20) NOT NULL, 
	status ENUM('Active', 'Inactive') NOT NULL,
	PRIMARY KEY(recruitment_id),
	FOREIGN KEY(sponsor_id) REFERENCES sponsor_info(sponsor_id)
);

# recruitment requirement junction: a junction between the recruitment_list table and recruitment_content table
CREATE TABLE IF NOT EXISTS recruit_req_junc(
	recruitment_id VARCHAR(36) NOT NULL,
	spec_id VARCHAR(36) NOT NULL,
	count INT NOT NULL,
	PRIMARY KEY(recruitment_id, spec_id),
	FOREIGN KEY(recruitment_id) REFERENCES recruitment_list(recruitment_id),
	FOREIGN KEY(spec_id) REFERENCES spec_list(spec_id) ON DELETE CASCADE
);

#recruitment_content: consists of the values in the recruitment list
CREATE TABLE IF NOT EXISTS recruitment_content(
	recruitment_id VARCHAR(36) NOT NULL,
	candidate_id VARCHAR(36) NOT NULL,
	shortlist INT NOT NULL, # 1=> shortlisted candidate, 0=> not shortlisted
	interview INT NOT NULL, # 2=> interveiw selected, 0=> not selected
	PRIMARY KEY(recruitment_id, candidate_id),
	FOREIGN KEY(recruitment_id) REFERENCES recruitment_list(recruitment_id),
	FOREIGN KEY(candidate_id) REFERENCES candidate_info(candidate_id)
);