import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';

interface UserAttributes {
    UserID: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    PhoneNumber: string;
    Gender: string;
    UserType: number;
    ResumePath?: string;
    ProfilePicturePath?: string;
    AgencyName?: string;
    IsFirstLogin: boolean;
    Hobbies?: string;
    AssociatedAgencyID?: number | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'UserID' | 'ResumePath' | 'ProfilePicturePath' | 'AgencyName' | 'Hobbies' | 'AssociatedAgencyID'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public UserID!: number;
    public FirstName!: string;
    public LastName!: string;
    public Email!: string;
    public Password!: string;
    public PhoneNumber!: string;
    public Gender!: string;
    public UserType!: number;
    public ResumePath?: string;
    public ProfilePicturePath?: string;
    public AgencyName?: string;
    public IsFirstLogin!: boolean;
    public Hobbies?: string;
    public AssociatedAgencyID?: number | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        UserID: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        FirstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        Password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        PhoneNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                len: [10, 10],
                isNumeric: true,
            },
        },
        Gender: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        UserType: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: {
                isIn: [[1, 2]], // 1 = Job Seeker, 2 = Agency
            },
        },
        ResumePath: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        ProfilePicturePath: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        AgencyName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        IsFirstLogin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        Hobbies: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        AssociatedAgencyID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'UserID',
            },
        },
    },
    {
        sequelize,
        tableName: 'Users',
    }
);

export default User;
