CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20),
    AvartarURL VARCHAR(255) NOT NULL,
    Skill TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Experience INT DEFAULT 0,  -- Years of experience
    CV_URL VARCHAR(255),  -- Stores resume links instead of files
    AverageRating FLOAT DEFAULT 0
);

CREATE TABLE Companies (
    CompanyID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Address TEXT,
    AvartarURL VARCHAR(255) NOT NULL,
    AverageRating FLOAT DEFAULT 0,
    OwnerID INT,
    Description TEXT,
    FOREIGN KEY (OwnerID) REFERENCES Users(UserID) ON DELETE SET NULL
);

CREATE TABLE Projects (
    ProjectID INT PRIMARY KEY AUTO_INCREMENT,
    ProjectName VARCHAR(255) NOT NULL,
    UploadedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpiredDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Budget DECIMAL(10,2) NOT NULL,
    OwnerID INT,
    Description TEXT,
    WorkingType ENUM('onsite', 'remote', 'hybrid') NOT NULL,
    WorkingPlace VARCHAR(255),
    Field VARCHAR(255),
    Status ENUM('open', 'closed', 'in-progress') DEFAULT 'open',
    AverageRating FLOAT DEFAULT 0,
    FOREIGN KEY (OwnerID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE ProjectApplicants (
    ProjectID INT,
    UserID INT,
    AppliedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    PRIMARY KEY (ProjectID, UserID),
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Ratings (
    RatingID INT PRIMARY KEY AUTO_INCREMENT,
    RatedUserID INT,
    RaterID INT,
    Score INT CHECK (Score BETWEEN 1 AND 5),
    Comment TEXT,
    RatingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RatedUserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (RaterID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Conversations (
    ConversationID INT PRIMARY KEY AUTO_INCREMENT,
    User1_ID INT NOT NULL,
    User2_ID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (User1_ID, User2_ID),
    FOREIGN KEY (User1_ID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (User2_ID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Messages (
    MessageID INT PRIMARY KEY AUTO_INCREMENT,
    ConversationID INT NOT NULL,
    SenderID INT NOT NULL,
    Content TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ConversationID) REFERENCES Conversations(ConversationID) ON DELETE CASCADE,
    FOREIGN KEY (SenderID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE MessageAttachments (
    AttachmentID INT PRIMARY KEY AUTO_INCREMENT,
    MessageID INT NOT NULL,
    FileURL VARCHAR(255) NOT NULL,  -- Stores link to the file
    FileType ENUM('image', 'video', 'document', 'pdf', 'excel') NOT NULL,  -- Type of file
    UploadedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MessageID) REFERENCES Messages(MessageID) ON DELETE CASCADE
);

CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    SenderID INT,
    ReceiverID INT,
    Salary DECIMAL(10,2) NOT NULL,
    PaymentMethod ENUM('PayPal', 'Credit Card', 'Bank Transfer'),
    TransactionStatus ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SenderID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE UserProjects (
    UserID INT,
    ProjectID INT,
    Role ENUM('posted', 'completed'),  -- NEW: Tracks whether user posted or completed the project
    PRIMARY KEY (UserID, ProjectID, Role),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID) ON DELETE CASCADE
);