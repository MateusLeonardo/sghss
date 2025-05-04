import { Module } from "@nestjs/common";
import { CaslAbilityService } from "./casl-ability/casl-ability.service";

@Module({
    imports: [],
    controllers: [],
    providers: [CaslAbilityService],
    exports: [CaslAbilityService],
})

export class CaslAbilityModule {}