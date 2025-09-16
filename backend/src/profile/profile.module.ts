import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { SupabaseModule } from "src/supabase/supabase.module";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { SupabaseService } from "src/supabase/supabase.service";

@Module({
    imports: [
        SupabaseModule
    ],
    controllers: [ProfileController],
    providers: [ProfileService, CloudinaryService, SupabaseService],
    exports: [ProfileService]
})

export class ProfileModule {}