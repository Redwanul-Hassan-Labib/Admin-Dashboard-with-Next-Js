import { IUser } from '@/types/user';
import mongoose from 'mongoose';
import slugify from 'slugify';

const userSchema = new mongoose.Schema<IUser>(
  {
    clerkUserId: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      required: true,
    },
    profilePicture: { type: String },
    slug: { type: String },
  },
  { timestamps: true },
);

// Add indexes
userSchema.index({ clerkUserId: 1 }, { unique: true }); // For Clerk user ID lookups
userSchema.index({ email: 1 }, { unique: true }); // For email lookups
userSchema.index({ slug: 1 }, { unique: true }); // For slug lookups
userSchema.index({ role: 1 }); // For role filtering
userSchema.index({ createdAt: -1 }); // For sorting by date
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' }); // For text search

// Pre-save hook to generate slug for new documents or when firstName/lastName is modified
userSchema.pre('save', async function (next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    // Use email as fallback if firstName and lastName are missing
    const name = `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.email.split('@')[0];
    let slug = slugify(name, { lower: true, strict: true });
    const existingUser = await mongoose.models.User.findOne({ slug });

    if (existingUser) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    this.slug = slug;
  }
  next();
});

// Pre-update hook to update slug when firstName or lastName is modified during updates
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as {
    firstName?: string;
    lastName?: string;
    slug?: string;
    email?: string;
  };
  if (update.firstName !== undefined || update.lastName !== undefined) {
    // Fetch current document to get existing firstName/lastName if not provided in update
    const currentUser = await mongoose.models.User.findOne(this.getQuery());
    const name = `${update.firstName || currentUser?.firstName || ''} ${update.lastName || currentUser?.lastName || ''}`.trim() || (update.email || currentUser?.email || '').split('@')[0];
    let slug = slugify(name, { lower: true, strict: true });

    const existingUser = await mongoose.models.User.findOne({
      slug,
      _id: { $ne: this.getQuery()._id }, // Exclude the current document
    });

    if (existingUser) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    update.slug = slug;
  }
  next();
});

const User = mongoose.models?.User || mongoose.model<IUser>('User', userSchema);

export default User;
